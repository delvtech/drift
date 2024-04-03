import { Abi } from 'abitype';
import {
  AbiEntry,
  AbiObjectType,
  AbiParameters,
  AbiParametersToObject,
  NamedAbiParameter,
} from 'src/contract/types/AbiEntry';

/**
 * Get a union of event names from an abi
 */
export type EventName<TAbi extends Abi> = AbiEntry<TAbi, 'event'>['name'];

/**
 * Get a union of named input parameters for an event from an abi
 */
type NamedEventInput<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = Extract<
  AbiParameters<TAbi, 'event', TEventName, 'inputs'>[number],
  NamedAbiParameter
>;

/**
 * Get an object type for an event's arguments from an abi.
 */
export type EventArgs<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = AbiObjectType<TAbi, 'event', TEventName, 'inputs'>;

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
  AbiParametersToObject<IndexedEventInput<TAbi, TEventName>[], 'inputs'>
>;

/**
 * A strongly typed event object based on an abi
 */
export interface Event<
  TAbi extends Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> {
  eventName: TEventName;
  args: EventArgs<TAbi, TEventName>;
  data?: `0x${string}`;
  blockNumber?: bigint;
  transactionHash?: `0x${string}`;
}
