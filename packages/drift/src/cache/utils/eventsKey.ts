import type { Abi } from "abitype";
import type { EventName } from "src/adapter/contract/types/Event";
import type { DriftEventsKeyParams } from "src/cache/DriftCache/types";
import { createSimpleCacheKey } from "src/cache/SimpleCache/createSimpleCacheKey";
import type { SimpleCacheKey } from "src/cache/SimpleCache/types";

export function eventsKey<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
>({
  abi,
  namespace,
  ...params
}: DriftEventsKeyParams<TAbi, TEventName>): SimpleCacheKey {
  return createSimpleCacheKey([namespace, "events", params]);
}
