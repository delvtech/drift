import type { SimpleCache } from "src/cache/types";
import type { SerializableKey } from "src/utils/createSerializableKey";
import type { AwaitedReturnType, MaybePromise } from "src/utils/types";

// TODO: Ensure the use of `await` here doesn't break batching.

/**
 * Checks the cache for the key and returns the value if found, otherwise
 * executes the function and stores the result in the cache before returning it.
 */
export async function cachedFn<T extends (...args: any[]) => MaybePromise<any>>({
  cache,
  key,
  fn,
}: {
  cache: SimpleCache;
  key: MaybePromise<SerializableKey>;
  fn: T;
}): Promise<AwaitedReturnType<T>> {
  key = await key;
  if (await cache.has(key)) return cache.get(key);

  const value = await fn();
  if (!value) return value;

  const setOp = cache.set(key, value);
  return setOp instanceof Promise ? setOp.then(() => value) : value;
}
