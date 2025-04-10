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
 * Creates a stub event for testing.
 */
export function createStubEvent<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
>({
  abi,
  eventName,
  args,
  blockNumber,
  ...overrides
}: CreateStubEventParams<TAbi, TEventName>): EventLog<TAbi, TEventName> {
  return {
    eventName,
    args,
    blockNumber: 1n,
    data: randomHex(),
    transactionHash: randomHex(),
    ...overrides,
  } as EventLog<TAbi, TEventName>;
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
 * Creates multiple stub events for testing.
 */
export function createStubEvents<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
>({
  abi,
  eventName,
  events,
}: CreateStubEventsParams<TAbi, TEventName>): EventLog<TAbi, TEventName>[] {
  return events.map((event) =>
    createStubEvent({ abi, eventName, ...event } as CreateStubEventParams<
      TAbi,
      TEventName
    >),
  );
}
