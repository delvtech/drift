import type { SerializableKey } from "src/utils/createSerializableKey";

/**
 * Represents a simple caching mechanism with basic operations such as
 * get, set, delete, clear, and find.
 *
 * @template TValue - The type of value to be stored in the cache.
 * @template TKey - The type of key used to access values in the cache.
 * Must be a serializable value to ensure consistency and predictability.
 */
export interface SimpleCache<
  TValue = any,
  TKey extends SerializableKey = SerializableKey,
> {
  /**
   * Returns an iterable of key-value pairs for every entry in the cache.
   */
  readonly entries: Iterable<[TKey, TValue]>;

  /**
   * Returns a boolean indicating whether an entry exists for the specified key.
   */
  has: (key: TKey) => boolean;

  /**
   * Retrieves the value associated with the specified key.
   */
  get: (key: TKey) => TValue | undefined;

  /**
   * Associates the specified value with the specified key in the cache. If the
   * cache previously contained a mapping for the key, the old value is
   * replaced.
   */
  set: (key: TKey, value: TValue) => void;

  /**
   * Removes the mapping for the specified key from this cache if present.
   */
  delete: (key: TKey) => void;

  /**
   * Removes all of the mappings from this cache.
   */
  clear: () => void;

  /**
   * Returns the the first value from the cache that the specified predicate
   * matches, or undefined if no match is found.
   *
   * @param predicate - A function to test each key-value pair in the cache.
   */
  find: (
    predicate: (value: TValue, key: TKey) => boolean,
  ) => TValue | undefined;
}
