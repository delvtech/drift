import type { Abi } from "src/adapter/types/Abi";
import type { EventLog, EventName } from "src/adapter/types/Event";
import { randomHex } from "src/utils/testing/randomHex";
import type { Eval, PartialBy } from "src/utils/types";

type PartialEventLog<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = PartialBy<
  EventLog<TAbi, TEventName>,
  "data" | "transactionHash" | "blockNumber" | "blockHash" | "logIndex"
>;

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
  const { abi, ...overrides } = params;
  return {
    blockHash: randomHex(32),
    blockNumber: 1n,
    data: randomHex(),
    logIndex: 0,
    transactionHash: randomHex(32),
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
