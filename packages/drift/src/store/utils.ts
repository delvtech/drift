import type { Store } from "src/store/types";
import type { AwaitedReturnType, MaybePromise } from "src/utils/types";

// TODO: Ensure the use of `await` here doesn't break batching.

/**
 * Checks the cache for the key and returns the value if found, otherwise
 * executes the function and stores the result in the cache before returning it.
 */
export async function cachedFn<
  T extends (...args: any[]) => MaybePromise<any>,
>({
  store,
  key,
  fn,
}: {
  store: Store;
  key: MaybePromise<string>;
  fn: T;
}): Promise<AwaitedReturnType<T>> {
  key = await key;
  if (await store.has(key)) return store.get(key);

  const value = await fn();
  if (!value) return value;

  const setOp = store.set(key, value);
  return setOp instanceof Promise ? setOp.then(() => value) : value;
}
