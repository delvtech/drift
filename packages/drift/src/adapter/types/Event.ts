import type {
  Abi,
  AbiEntryName,
  AbiObjectType,
  AbiParameters,
  AbiParametersToObject,
  Bytes,
  Hash,
  NamedAbiParameter,
} from "src/adapter/types/Abi";

/**
 * Get a union of event names from an abi
 */
export type EventName<TAbi extends Abi> = AbiEntryName<TAbi, "event">;

/**
 * Get a union of named input parameters for an event from an abi
 */
type NamedEventInput<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = Extract<
  AbiParameters<TAbi, "event", TEventName, "inputs">[number],
  NamedAbiParameter
>;

/**
 * Get an object type for an event's arguments from an abi.
 */
export type EventArgs<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = AbiObjectType<TAbi, "event", TEventName, "inputs">;

/**
 * Get a union of indexed input objects for an event from an abi
 */
type IndexedEventInput<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = Extract<NamedEventInput<TAbi, TEventName>, { indexed: true }>;

/**
 * Get an object type for an event's indexed fields from an abi
 */
export type EventFilter<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = Partial<
  AbiParametersToObject<IndexedEventInput<TAbi, TEventName>[], "inputs">
>;

/**
 * A strongly typed event object based on an abi
 */
// https://github.com/ethereum/execution-apis/blob/de87e24e0f2fbdbaee0fa36ab61b8ec25d3013d0/src/schemas/receipt.yaml#L1
export type EventLog<
  TAbi extends Abi = Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> = {
  /**
   * The name of the emitted event.
   */
  eventName: TEventName;
  /**
   * The decoded arguments of the event.
   */
  args: EventArgs<TAbi, TEventName>;
  /**
   * Zero or more 32 Bytes non-indexed arguments of the event.
   */
  data: Bytes;
  /**
   * The hash of the block this log was in or `undefined` if pending.
   */
  blockHash: Hash | undefined;
  /**
   * The block number this log was in or `undefined` if pending.
   */
  blockNumber: bigint | undefined;
  /**
   * The index of the log in the block or `undefined` if pending.
   */
  logIndex: number | undefined;
  /**
   * The hash of the transaction this event was created from or `undefined` if pending.
   */
  transactionHash: Hash | undefined;
};
