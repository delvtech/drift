import type { Abi } from "abitype";
import isMatch from "lodash.ismatch";
import type { FunctionName } from "src/adapter/contract/types/Function";
import type { DriftReadKeyParams } from "src/cache/DriftCache/types";
import type { SimpleCache, SimpleCacheKey } from "src/cache/SimpleCache/types";
import { partialReadKey } from "src/cache/utils/partialReadKey";
import type { DeepPartial } from "src/utils/types";

export function invalidateReadsMatching<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
>(
  cache: SimpleCache,
  params: DeepPartial<DriftReadKeyParams<TAbi, TFunctionName>>,
): void | Promise<void> {
  const sourceKey = partialReadKey(params);

  for (const [key] of cache.entries) {
    if (
      typeof key === "object" &&
      isMatch(key, sourceKey as SimpleCacheKey[])
    ) {
      cache.delete(key);
    }
  }
}
