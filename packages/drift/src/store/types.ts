import type { MaybePromise } from "src/utils/types";

/**
 * A minimal interface for storing and retrieving values in a cache. The methods
 * may be synchronous or asynchronous.
 */
export interface Store {
  /**
   * Returns an iterable of key-value pairs for every entry in the store.
   */
  entries: () => Iterable<[string, any]> | AsyncIterable<[string, any]>;

  /**
   * Returns a boolean indicating whether an entry exists for the specified key.
   */
  has: (key: string) => MaybePromise<boolean>;

  /**
   * Retrieves the value associated with the specified key.
   */
  get: (key: string) => MaybePromise<any>;

  /**
   * Associates the specified value with the specified key in the store. If the
   * store previously contained a mapping for the key, the old value is
   * replaced.
   */
  set: (key: string, value: any) => MaybePromise<any>;

  /**
   * Removes the mapping for the specified key from this store if present.
   */
  delete: (key: string) => MaybePromise<any>;

  /**
   * Removes all of the mappings from this store.
   */
  clear: () => MaybePromise<any>;
}
