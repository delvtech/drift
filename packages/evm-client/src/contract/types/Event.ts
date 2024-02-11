import { Abi } from 'abitype';
import { EmptyObject } from 'src/base/types';
import {
  AbiEntry,
  AbiFriendlyType,
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
  AbiEntry<TAbi, 'event', TEventName>['inputs'][number],
  NamedAbiParameter
>;

/**
 * Get a user-friendly argument type for an abi event, which is determined by
 * it's inputs:
 * - __Single input:__ the type of the single input.
 * - __Multiple inputs:__ an object with the input names as keys and the input
 *   types as values.
 * - __No inputs:__ `undefined`.
 */
export type EventArgs<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = AbiFriendlyType<TAbi, 'event', TEventName, 'inputs'>;

/**
 * Get a union of indexed input objects for an event from an abi
 */
type IndexedEventInput<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = Extract<NamedEventInput<TAbi, TEventName>, { indexed: true }>;

/**
 * Get an object type for an event's indexed fields from an abi or `undefined`
 * if there are no indexed fields.
 */
export type EventFilter<TAbi extends Abi, TEventName extends EventName<TAbi>> =
  AbiParametersToObject<
    IndexedEventInput<TAbi, TEventName>[],
    'inputs'
  > extends infer TParamObject
    ? TParamObject extends EmptyObject
      ? undefined
      : Partial<
          AbiParametersToObject<IndexedEventInput<TAbi, TEventName>[], 'inputs'>
        >
    : never;

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
