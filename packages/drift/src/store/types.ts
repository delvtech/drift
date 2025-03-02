import type { MaybePromise } from "src/utils/types";

/**
 * An interface for storing and retrieving values in a cache. The store may be
 * synchronous or asynchronous.
 */
export interface CacheStore {
  /**
   * Returns an iterable of key-value pairs for every entry in the store.
   */
  entries: () => Iterable<[string, any]> | AsyncIterable<[string, any]>;

  /**
   * Returns the the first value from the store that the specified predicate
   * matches, or undefined if no match is found.
   *
   * @param predicate - A function to test each key-value pair in the store.
   */
  find: (
    predicate: (value: any, key: string) => boolean,
  ) => MaybePromise<any | undefined>;

  /**
   * Returns a boolean indicating whether an entry exists for the specified key.
   */
  has: (key: string) => MaybePromise<boolean>;

  /**
   * Retrieves the value associated with the specified key.
   */
  get: (key: string) => MaybePromise<any | undefined>;

  /**
   * Associates the specified value with the specified key in the store. If the
   * store previously contained a mapping for the key, the old value is
   * replaced.
   */
  set: (key: string, value: any) => MaybePromise<void>;

  /**
   * Removes the mapping for the specified key from this store if present.
   */
  delete: (key: string) => MaybePromise<void>;

  /**
   * Removes all of the mappings from this store.
   */
  clear: () => MaybePromise<void>;
}
