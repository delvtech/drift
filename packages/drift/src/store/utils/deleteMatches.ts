import isMatch from "lodash.ismatch";
import type { Store } from "src/store/types";
import type { MaybePromise } from "src/utils/types";

/**
 * Deletes all entries in the store that match the `matchKey`.
 *
 * @param store - The store to delete entries from.
 * @param matchKey - The key to match against. This can be a partial object to
 * delete entries based on a subset of properties.
 */
export async function deleteMatches(
  store: Store,
  matchKey: string,
): Promise<void> {
  const parsedMatchKey = JSON.parse(matchKey);
  const operations: MaybePromise<void>[] = [];

  for await (const [key] of store.entries()) {
    if (key === matchKey) {
      operations.push(store.delete(key));
      continue;
    }
    const parsedKey = JSON.parse(key);
    if (isMatch(parsedKey, parsedMatchKey)) {
      operations.push(store.delete(key));
    }
  }

  await Promise.all(operations);
}
