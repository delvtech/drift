import isMatch from "lodash.ismatch";
import type { Store } from "src/store/types";
import type { MaybePromise } from "src/utils/types";

/**
 * Deletes all entries in the store whose keys match the provided key.
 *
 * **Important**: This assumes that the keys in the store are JSON strings.
 */
export async function deleteMatches({
  store,
  matchKey,
}: {
  /**
   * The store to delete entries from.
   */
  store: Store;
  /**
   * The key to match against.
   */
  matchKey: MaybePromise<string>;
}): Promise<void> {
  matchKey = await matchKey;
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
