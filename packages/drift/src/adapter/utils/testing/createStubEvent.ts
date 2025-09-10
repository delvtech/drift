import type { Abi } from "src/adapter/types/Abi";
import type { EventLog, EventName } from "src/adapter/types/Event";
import { randomAddress } from "src/utils/testing/randomAddress";
import { randomHex } from "src/utils/testing/randomHex";
import { randomInt } from "src/utils/testing/randomInt";
import type { Eval, RequiredBy } from "src/utils/types";

type PartialEventLog<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = RequiredBy<Partial<EventLog<TAbi, TEventName>>, "eventName" | "args">;

type CreateStubEventParams<
  TAbi extends Abi = Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> = Eval<
  {
    abi?: TAbi;
    eventName: TEventName;
  } & PartialEventLog<TAbi, TEventName>
>;

/**
 * Creates a stub event log for testing.
 */
export function createStubEvent<
  TAbi extends Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
>(params: CreateStubEventParams<TAbi, TEventName>): EventLog<TAbi, TEventName> {
  const { abi: _, ...overrides } = params;
  const transactionIndex = overrides.transactionIndex ?? randomInt(0, 500);
  return {
    address: randomAddress(),
    blockHash: randomHex(32),
    blockNumber: BigInt(randomInt(0, 50_000_000)),
    data: randomHex(),
    logIndex: randomInt(transactionIndex + 1, transactionIndex * 2),
    removed: false,
    topics: [],
    transactionHash: randomHex(32),
    transactionIndex,
    ...overrides,
  };
}

type CreateStubEventsParams<
  TAbi extends Abi = Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> = Eval<{
  abi: TAbi;
  eventName: TEventName;
  events: readonly Eval<Omit<PartialEventLog<TAbi, TEventName>, "eventName">>[];
}>;

/**
 * Creates multiple stub event logs for testing.
 */
export function createStubEvents<
  TAbi extends Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
>(
  params: CreateStubEventsParams<TAbi, TEventName>,
): EventLog<TAbi, TEventName>[] {
  const { abi, eventName, events } = params;
  return events.map((overrides, i) =>
    createStubEvent({ abi, eventName, logIndex: i, ...overrides }),
  );
}
