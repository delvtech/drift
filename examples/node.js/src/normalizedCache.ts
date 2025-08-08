import {
  type Abi,
  type Adapter,
  type Address,
  createDrift,
  type EventLog,
  type EventName,
  erc20,
  formatArgsForDisplay,
  type GetEventsParams,
  type RangeBlock,
  stringifyKey,
} from "@delvtech/drift";
import { createStubEvent, randomAddress } from "@delvtech/drift/testing";
import { parseFixed, randomFixed } from "@gud/math";
import { LRUCache } from "lru-cache";

type StringifiedObject = `{${string}}`;

/**
 * Normalized cache key for storing event logs.
 *
 * Key elements:
 * - Chain ID
 * - Block Number
 * - Log Index
 *
 * @example
 * "1:23043913:0"
 */
type EventKey = `${number}:${bigint}:${number}`;
type EventCache = LRUCache<EventKey, EventLog<any, any>>;

/**
 * Normalized cache key for storing queries.
 *
 * Key elements:
 * - Chain ID
 * - Contract Address
 * - Event Name
 * - From Block
 * - To Block
 * - Normalized Filter
 *
 * @example
 * "1:0x6B175474E89094C44Da98b954EedeAC495271d0F:Transfer:0:100:{\"from\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"}"
 *
 * @example
 * "1:0x6B175474E89094C44Da98b954EedeAC495271d0F:Transfer:0xc1ee38692da6231e54c304788da52c5d7c6c5b7295035b21e2339bf248cc6b43:latest:{}"
 */
type QueryKey =
  `${number}:${Address}:${string}:${RangeBlock}:${RangeBlock}:{${string}}`;
type QueryCache = LRUCache<QueryKey, EventKey[]>;

/**
 * Normalized cache key for storing filter coverage.
 *
 * Key elements:
 * - Chain ID
 * - Contract Address
 * - Event Name
 * - Filter
 *
 * @example
 * "1:0x6B175474E89094C44Da98b954EedeAC495271d0F:Transfer:{\"from\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"}"
 *
 * @example
 * "1:0x6B175474E89094C44Da98b954EedeAC495271d0F:Transfer:{}"
 */
type FilterCoverageKey = `${number}:0x${string}:${string}:{${string}}`;
type EventRange = {
  fromBlock: bigint;
  toBlock: bigint;
};
type FilterCoverageIndex = LRUCache<
  FilterCoverageKey,
  {
    coveredRanges: EventRange[];
    eventsByBlock: Map<bigint, EventKey[]>;
  }
>;

// Caches
const eventCache: EventCache = new LRUCache({
  max: 100_000,
});
const queryCache: QueryCache = new LRUCache({
  max: 500,
});
const filterCoverageIndex: FilterCoverageIndex = new LRUCache({
  max: 100,
});

// Cache keys
function createEventKey(
  chainId: number,
  blockNumber: bigint,
  logIndex: number,
): EventKey {
  return `${chainId}:${blockNumber}:${logIndex}`;
}
function parseEventKey(key: EventKey): {
  chainId: number;
  blockNumber: bigint;
  logIndex: number;
} {
  const [chainId, blockNumber, logIndex] = key.split(":");
  return {
    chainId: Number(chainId),
    blockNumber: BigInt(blockNumber),
    logIndex: Number(logIndex),
  };
}
function createQueryKey(
  chainId: number,
  {
    address,
    event,
    fromBlock = "earliest",
    toBlock = "latest",
    filter = {},
  }: GetEventsParams,
): QueryKey {
  return `${chainId}:${address}:${event}:${fromBlock}:${toBlock}:${stringifyKey(filter) as StringifiedObject}`;
}
function createFilterCoverageKey<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
>(
  chainId: number,
  { address, event, filter = {} }: GetEventsParams<TAbi, TEventName>,
): FilterCoverageKey {
  return `${chainId}:${address}:${event}:${stringifyKey(filter) as StringifiedObject}`;
}

// Data
// const eventData = parseKey(readFileSync("daiEvents.json", "utf-8"));
const chainId = 1;

// Tuning parameters //

// Minimum gap between missing ranges to consider them separate. If the gap
// between 2 ranges is less than this, they will be merged into one range to
// prevent excessive request fragmentation.
const MIN_MISSING_RANGE_GAP = 11n;

// Main Logic //

export async function getEvents<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
>(
  adapter: Adapter,
  params: GetEventsParams<TAbi, TEventName>,
): Promise<EventLog<TAbi, TEventName>[]> {
  // Check QueryCache
  const queryKey = createQueryKey(chainId, params);
  const cachedQueryKeys = queryCache.get(queryKey);

  if (cachedQueryKeys) {
    const { events, evictedRanges, evictedIndicesByKey } =
      getCachedEvents(cachedQueryKeys);

    // Repair evicted events
    if (evictedRanges.length) {
      for (const { fromBlock, toBlock } of evictedRanges) {
        const refetchedEvents = await adapter.getEvents({
          ...params,
          fromBlock,
          toBlock,
        });
        for (const event of refetchedEvents) {
          const key = createEventKey(
            chainId,
            event.blockNumber!,
            event.logIndex!,
          );
          eventCache.set(key, event);
          const evictedIndex = evictedIndicesByKey.get(key);
          if (evictedIndex !== undefined) {
            events[evictedIndex] = event;
          }
        }
      }
    }

    console.log("Returning from query cache");
    return events;
  }

  // Resolve fromBlock and toBlock
  const fromBlock =
    (await getBlockRangeNumber({
      adapter,
      block: params.fromBlock,
    })) ?? 0n;
  const toBlock =
    (await getBlockRangeNumber({
      adapter,
      block: params.toBlock,
    })) ?? (await adapter.getBlockNumber());

  // Check FilterCoverageIndex
  const filterCoverageKey = createFilterCoverageKey(chainId, params);
  const coverage = filterCoverageIndex.get(filterCoverageKey);

  if (coverage) {
    const updatedCoverage = computeCoverage(coverage.coveredRanges, {
      fromBlock,
      toBlock,
    });

    // Handle missing ranges
    if (updatedCoverage.missing.length) {
      const rangesToFetch = [];
      let pendingRange: EventRange | undefined;

      // Merge ranges if the gap between them is smaller than the minimum to
      // reduce request fragmentation.
      for (const range of updatedCoverage.missing) {
        if (!pendingRange) {
          pendingRange = range;
          continue;
        }

        // Merge ranges if the gap is smaller than the minimum.
        if (range.fromBlock < pendingRange.toBlock + MIN_MISSING_RANGE_GAP) {
          pendingRange.toBlock = range.toBlock;
          continue;
        }

        rangesToFetch.push(pendingRange);
        pendingRange = range;
      }

      if (pendingRange) {
        rangesToFetch.push(pendingRange);
      }

      // Fetch missing ranges
      for (const range of rangesToFetch) {
        const fetchedEvents = await adapter.getEvents({
          ...params,
          ...range,
        });

        // Add new events to the cache and coverage index
        for (const event of fetchedEvents) {
          const key = createEventKey(
            chainId,
            event.blockNumber!,
            event.logIndex!,
          );
          eventCache.set(key, event);
          coverage.eventsByBlock.set(event.blockNumber!, [
            ...(coverage.eventsByBlock.get(event.blockNumber!) ?? []),
            key,
          ]);
        }
      }

      // Update coverage index with new ranges
      coverage.coveredRanges = updatedCoverage.merged;
    }

    // Return cached events
    const queryKeys: EventKey[] = [];
    const events: EventLog<TAbi, TEventName>[] = [];
    for (let i = fromBlock; i <= toBlock; i++) {
      const eventKeys = coverage.eventsByBlock.get(i) ?? [];
      for (const key of eventKeys) {
        queryKeys.push(key);
        const event = eventCache.get(key);
        if (event) {
          events.push(event as EventLog<TAbi, TEventName>);
        }
      }
    }
    queryCache.set(queryKey, queryKeys);

    console.log("Returning from filter coverage index");
    return events;
  }

  const fetchedEvents = await adapter.getEvents(params);

  // Add fetched events to the cache
  const newCoverage = {
    coveredRanges: [{ fromBlock, toBlock }],
    eventsByBlock: new Map(),
  };
  const queryKeys: EventKey[] = [];
  for (const event of fetchedEvents) {
    const blockNumber = event.blockNumber!;
    const key = createEventKey(chainId, blockNumber, event.logIndex!);
    queryKeys.push(key);
    eventCache.set(key, event);
    const blockEvents = newCoverage.eventsByBlock.get(blockNumber);
    if (blockEvents) {
      blockEvents.push(key);
    } else {
      newCoverage.eventsByBlock.set(blockNumber, [key]);
    }
  }
  queryCache.set(queryKey, queryKeys);
  filterCoverageIndex.set(filterCoverageKey, newCoverage);

  console.log("Returning fetched events");
  return fetchedEvents;
}

async function getBlockRangeNumber({
  adapter,
  block,
}: {
  block?: RangeBlock;
  adapter: Adapter;
}): Promise<bigint | undefined> {
  let blockBigInt: bigint | undefined;

  if (typeof block === "string") {
    if (block === "earliest") {
      blockBigInt = 0n;
    } else {
      const { number } = await adapter.getBlock(block);
      if (number !== undefined) {
        blockBigInt = BigInt(number);
      }
    }
  } else {
    blockBigInt = block;
  }

  return blockBigInt;
}

function getCachedEvents(cachedEventKeys: EventKey[]): {
  events: EventLog<any, any>[];
  evictedRanges: EventRange[];
  evictedIndicesByKey: Map<EventKey, number>;
} {
  const events: EventLog[] = [];
  const evictedIndicesByKey = new Map<EventKey, number>();
  const evictedRanges: EventRange[] = [];
  let pendingEvictedRange: EventRange | undefined;

  for (const [i, eventKey] of cachedEventKeys.entries()) {
    const event = eventCache.get(eventKey);

    if (event) {
      events.push(event);
      continue;
    }

    evictedIndicesByKey.set(eventKey, i);
    const { blockNumber } = parseEventKey(eventKey);

    // Start a new pending range if there isn't one.
    if (!pendingEvictedRange) {
      pendingEvictedRange = {
        fromBlock: blockNumber,
        toBlock: blockNumber,
      };
      continue;
    }

    // Extend the pending range if the gap is smaller than the minimum.
    if (blockNumber < pendingEvictedRange.toBlock + MIN_MISSING_RANGE_GAP) {
      pendingEvictedRange.toBlock = blockNumber;
      continue;
    }

    evictedRanges.push(pendingEvictedRange);
    pendingEvictedRange = {
      fromBlock: blockNumber,
      toBlock: blockNumber,
    };
  }

  // Add the final pending range if it exists.
  if (pendingEvictedRange) {
    evictedRanges.push(pendingEvictedRange);
  }

  return {
    events,
    evictedRanges,
    evictedIndicesByKey,
  };
}

export function computeCoverage(
  covered: EventRange[],
  requested: EventRange,
): {
  missing: EventRange[];
  merged: EventRange[];
} {
  const missing: EventRange[] = [];
  const merged: EventRange[] = [];
  let pending: EventRange | undefined = {
    fromBlock: requested.fromBlock,
    toBlock: requested.toBlock,
  };
  let cursor = requested.fromBlock;

  for (const range of covered) {
    // Ends before cursor
    if (range.toBlock < cursor) {
      if (!pending || range.toBlock + 1n < pending.fromBlock) {
        // no adjacency
        merged.push(range);
      } else {
        // merge with pending
        pending.fromBlock = range.fromBlock;
      }
      continue;
    }

    // Starts after requested
    if (requested.toBlock < range.fromBlock) {
      if (!pending || pending.toBlock + 1n < range.fromBlock) {
        // no adjacency
        if (pending) {
          merged.push(pending);
          pending = undefined;
        }
        merged.push(range);
      } else {
        // merge with pending
        pending.toBlock = range.toBlock;
      }
      continue;
    }

    if (pending && pending.toBlock < range.toBlock) {
      // Extend pending
      pending.toBlock = range.toBlock;
    }

    if (cursor < range.fromBlock) {
      missing.push({ fromBlock: cursor, toBlock: range.fromBlock - 1n });
    } else {
      if (pending) {
        // Merge with pending
        pending.fromBlock = range.fromBlock;
      }
    }

    // Advance cursor
    cursor = range.toBlock + 1n;
  }

  // Handle the end of the requested range
  if (cursor <= requested.toBlock) {
    missing.push({ fromBlock: cursor, toBlock: requested.toBlock });
  }

  if (pending) {
    merged.push(pending);
  }

  return { missing, merged };
}

////////////////////////////////////////////////////////////////////////////////
// Section start:

const drift = createDrift({
  rpcUrl: "http://localhost:8545",
  chainId: 1,
});

drift.hooks.on("before:getEvents", ({ args: [params], resolve }) => {
  console.log("Fetching events with params:", formatArgsForDisplay(params));
  const { fromBlock, toBlock, filter = {} } = params;
  if (typeof fromBlock === "bigint" && typeof toBlock === "bigint") {
    const events = Array.from(
      { length: Number(toBlock - fromBlock + 1n) },
      (_, i) => {
        return createStubEvent({
          abi: erc20.abi,
          eventName: "Transfer",
          args: {
            from: randomAddress(),
            to: randomAddress(),
            value: randomFixed({ min: 1, max: parseFixed(1_000_000) }).bigint,
            ...filter,
          },
          blockNumber: fromBlock + BigInt(i),
        });
      },
    );
    resolve(events as unknown as EventLog[]);
  } else {
    resolve([]);
  }
});

await getEvents(drift, {
  abi: erc20.abi,
  address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  event: "Transfer",
  fromBlock: 10n,
  toBlock: 20n,
});

await getEvents(drift, {
  abi: erc20.abi,
  address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  event: "Transfer",
  fromBlock: 30n,
  toBlock: 40n,
});

await getEvents(drift, {
  abi: erc20.abi,
  address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  event: "Transfer",
  fromBlock: 50n,
  toBlock: 60n,
});

await getEvents(drift, {
  abi: erc20.abi,
  address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  event: "Transfer",
  fromBlock: 15n,
  toBlock: 25n,
});

console.log(
  formatArgsForDisplay({
    eventCacheSize: eventCache.size,
    queryCacheSize: queryCache.size,
    filterCoverageIndexSize: filterCoverageIndex.size,
    coverage: [...filterCoverageIndex.entries()].map(([key, value]) => ({
      key,
      coveredRanges: value.coveredRanges,
    })),
  }),
);
