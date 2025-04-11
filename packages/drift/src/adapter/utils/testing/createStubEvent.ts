import type { Abi } from "src/adapter/types/Abi";
import type { EventLog, EventName } from "src/adapter/types/Event";
import { randomHex } from "src/utils/testing/randomHex";
import type { Eval, PartialBy } from "src/utils/types";

type CreateStubEventParams<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = Eval<
  {
    abi: TAbi;
    eventName: TEventName;
  } & PartialBy<
    EventLog<TAbi, TEventName>,
    "blockNumber" | "data" | "transactionHash"
  >
>;

/**
 * Creates a stub event log for testing.
 */
export function createStubEvent<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
>(params: CreateStubEventParams<TAbi, TEventName>): EventLog<TAbi, TEventName> {
  const { abi, ...overrides } = params;
  return {
    blockNumber: 1n,
    data: randomHex(),
    transactionHash: randomHex(),
    ...overrides,
  };
}

type CreateStubEventsParams<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = Eval<{
  abi: TAbi;
  eventName: TEventName;
  events: Eval<
    Omit<
      PartialBy<
        EventLog<TAbi, TEventName>,
        "blockNumber" | "data" | "transactionHash"
      >,
      "eventName"
    >
  >[];
}>;

/**
 * Creates multiple stub event logs for testing.
 */
export function createStubEvents<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
>(
  params: CreateStubEventsParams<TAbi, TEventName>,
): EventLog<TAbi, TEventName>[] {
  const { abi, eventName, events } = params;
  return events.map((overrides) =>
    createStubEvent({ abi, eventName, ...overrides }),
  );
}
