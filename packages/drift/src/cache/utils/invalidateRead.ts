import type { Abi } from "abitype";
import type { FunctionName } from "src/adapter/contract/types/function";
import type { DriftReadKeyParams } from "src/cache/DriftCache/types";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import { readKey } from "src/cache/utils/readKey";

export function invalidateRead<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
>(
  cache: SimpleCache,
  params: DriftReadKeyParams<TAbi, TFunctionName>,
): void | Promise<void> {
  return cache.delete(readKey(params));
}
