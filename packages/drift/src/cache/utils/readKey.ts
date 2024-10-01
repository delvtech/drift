import type { Abi } from "abitype";
import type { FunctionName } from "src/adapter/contract/types/Function";
import type { DriftReadKeyParams } from "src/cache/DriftCache/types";
import type { SimpleCacheKey } from "src/cache/SimpleCache/types";
import { partialReadKey } from "src/cache/utils/partialReadKey";

export function readKey<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
>(params: DriftReadKeyParams<TAbi, TFunctionName>): SimpleCacheKey {
  return partialReadKey(params);
}
