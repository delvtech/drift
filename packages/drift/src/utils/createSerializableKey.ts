import type { AnyObject } from "src/utils/types";

/**
 * Converts a given raw key into a `SerializableKey``.
 *
 * The method ensures that any given raw key, regardless of its structure, is
 * converted into a format suitable for consistent cache key referencing.
 *
 * - For strings, numbers, and booleans it returns them directly.
 * - For arrays, it recursively processes each element.
 * - For objects, it sorts the keys and then recursively processes each value,
 *   ensuring consistent key generation.
 * - For other types, it attempts to convert the raw key to a string.
 *
 * @param rawKey - The raw input to be converted into a cache key.
 * @returns A standardized key suitable for consistent referencing within a
 * cache.
 */
export function createSerializableKey(
  rawKey: string | number | boolean | symbol | AnyObject,
): SerializableKey {
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
            : createSerializableKey(value),
        );
      }

      const processedObject: Record<string, SerializableKey> = {};

      // sort keys to ensure consistent key generation
      for (const key of Object.keys(rawKey).sort()) {
        const value = rawKey[key];

        // ignore properties with undefined or null values
        if (value !== undefined && value !== null) {
          processedObject[key] = createSerializableKey(value);
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

/**
 * Represents possible serializable key types.
 */
export type SerializableKey =
  | KeyPrimitive
  | (SerializableKey | null | undefined)[]
  | {
      [key: string | number]: SerializableKey;
    };

/** Primitive types that can be used as part of a cache key. */
type KeyPrimitive = string | number | boolean;
