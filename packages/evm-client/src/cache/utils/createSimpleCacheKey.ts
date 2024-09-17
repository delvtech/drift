import { SimpleCacheKey } from "src/cache/types/SimpleCache";

type DefinedValue = NonNullable<
  Record<string, any> | string | number | boolean | symbol
>;

/**
 * Converts a given raw key into a `SimpleCacheKey``.
 *
 * The method ensures that any given raw key, regardless of its structure, is
 * converted into a format suitable for consistent cache key referencing.
 *
 * - For scalar (string, number, boolean), it returns them directly.
 * - For arrays, it recursively processes each element.
 * - For objects, it sorts the keys and then recursively processes each value,
 *   ensuring consistent key generation.
 * - For other types, it attempts to convert the raw key to a string.
 *
 * @param rawKey - The raw input to be converted into a cache key.
 * @returns A standardized cache key suitable for consistent referencing within
 * the cache.
 */
export function createSimpleCacheKey(rawKey: DefinedValue): SimpleCacheKey {
  switch (typeof rawKey) {
    case "string":
    case "number":
    case "boolean":
      return rawKey;

    case "object": {
      if (Array.isArray(rawKey)) {
        return rawKey.map((value) =>
          // undefined or null values are converted to null to follow the
          // precedent set by JSON.stringify
          value === undefined || value === null
            ? null
            : createSimpleCacheKey(value),
        );
      }

      const processedObject: Record<string, SimpleCacheKey> = {};

      // sort keys to ensure consistent key generation
      for (const key of Object.keys(rawKey).sort()) {
        const value = rawKey[key];

        // ignore properties with undefined or null values
        if (value !== undefined && value !== null) {
          processedObject[key] = createSimpleCacheKey(value);
        }
      }

      return processedObject;
    }

    default:
      try {
        return rawKey.toString();
      } catch (err) {
        throw new Error(`Unable to process cache key value: ${String(rawKey)}`);
      }
  }
}
