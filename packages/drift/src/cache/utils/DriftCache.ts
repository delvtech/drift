import type { Abi } from "abitype";
import type { Event, EventName } from "src/adapter/contract/types/Event";
import type {
  DriftEventsKeyParams
} from "src/cache/DriftCache/types";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import { eventsKey } from "src/cache/utils/eventsKey";

export function preloadEvents<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
>(
  cache: SimpleCache,
  {
    value,
    ...params
  }: DriftEventsKeyParams<TAbi, TEventName> & {
    value: readonly Event<TAbi, TEventName>[];
  },
): void | Promise<void> {
  return cache.set(eventsKey(params), value);
}
