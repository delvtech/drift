import type { Abi } from "abitype";
import type { FunctionName } from "src/adapter/contract/types/Function";
import type { DriftReadKeyParams } from "src/cache/DriftCache/types";
import { createSimpleCacheKey } from "src/cache/SimpleCache/createSimpleCacheKey";
import type { SimpleCacheKey } from "src/cache/SimpleCache/types";
import type { DeepPartial } from "src/utils/types";

export function partialReadKey<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
>({
  abi,
  namespace,
  ...params
}: DeepPartial<DriftReadKeyParams<TAbi, TFunctionName>>): SimpleCacheKey {
  return createSimpleCacheKey([namespace, "read", params]);
}
