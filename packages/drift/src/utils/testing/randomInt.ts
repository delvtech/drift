/**
 * Get a random integer.
 *
 * @param min - The minimum value. Default: `0`
 * @param max - The maximum value. Default: `Number.MAX_SAFE_INTEGER`
 * @returns A random integer between `min` and `max`, inclusive.
 */
export function randomInt(min = 0, max = Number.MAX_SAFE_INTEGER) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
