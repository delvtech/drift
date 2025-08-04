import isMatch from "lodash.ismatch";
import type { Store } from "src/store/Store";
// biome-ignore lint/correctness/noUnusedImports: used in doc comment.
import { parseKey, type stringifyKey } from "src/utils/keys";
import type { MaybePromise } from "src/utils/types";

/**
 * Deletes all entries in the store whose keys match the provided key.
 *
 * **Important**: This assumes that the keys in the store were stringified using
 * {@linkcode stringifyKey} or {@linkcode JSON.stringify}.
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
  const parsedMatchKey = parseKey(matchKey);
  const operations: MaybePromise<void>[] = [];

  for await (const [key] of store.entries()) {
    if (key === matchKey) {
      operations.push(store.delete(key));
      continue;
    }
    const parsedKey = parseKey(key);
    if (isMatch(parsedKey, parsedMatchKey)) {
      operations.push(store.delete(key));
    }
  }

  await Promise.all(operations);
}
