import type { SerializableKey } from "src/utils/createSerializableKey";
import type { MaybePromise } from "src/utils/types";

/**
 * Represents a cache store for storing and retrieving values. The store may be
 * synchronous or asynchronous.
 *
 * **Note:** The store implementation is expected to handle serialization and
 * deserialization of keys.
 *
 * @typeParam K - The type of key used to access values in the store.
 * @typeParam V - The type of value to be stored. Must be a serializable value
 * to ensure consistency and predictability.
 */
export interface CacheStore<
  K extends SerializableKey = SerializableKey,
  V = any,
> {
  /**
   * Returns an iterable of key-value pairs for every entry in the store.
   */
  entries: () => Iterable<[K, V]> | AsyncIterable<[K, V]>;

  /**
   * Returns the the first value from the store that the specified predicate
   * matches, or undefined if no match is found.
   *
   * @param predicate - A function to test each key-value pair in the store.
   */
  find: (
    predicate: (value: V, key: K) => boolean,
  ) => MaybePromise<V | undefined>;

  /**
   * Returns a boolean indicating whether an entry exists for the specified key.
   */
  has: (key: K) => MaybePromise<boolean>;

  /**
   * Retrieves the value associated with the specified key.
   */
  get: (key: K) => MaybePromise<V | undefined>;

  /**
   * Associates the specified value with the specified key in the store. If the
   * store previously contained a mapping for the key, the old value is
   * replaced.
   */
  set: (key: K, value: V) => MaybePromise<void>;

  /**
   * Removes the mapping for the specified key from this store if present.
   */
  delete: (key: K) => MaybePromise<void>;

  /**
   * Removes all of the mappings from this store.
   */
  clear: () => MaybePromise<void>;
}
