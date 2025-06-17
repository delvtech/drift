import { randomInt } from "src/utils/testing/randomInt";

/**
 * Get a random selection from an array.
 *
 * @param values - The array of values to select from.
 * @returns A random value from the array, or `undefined` if the array is empty.
 */
export function randomSelection<const T extends readonly any[]>(
  values: T,
): T extends readonly [] ? undefined : T[number] {
  return values[randomInt(0, values.length - 1)];
}
