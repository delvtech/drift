import type { Abi } from "abitype";
import type { FunctionName, FunctionReturn } from "src/adapter/contract/types/Function";
import type { DriftReadKeyParams } from "src/cache/DriftCache/types";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import { readKey } from "src/cache/utils/readKey";

export function preloadRead<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
>(
  cache: SimpleCache,
  {
    value,
    ...params
  }: DriftReadKeyParams<TAbi, TFunctionName> & {
    value: FunctionReturn<TAbi, TFunctionName>;
  },
): void | Promise<void> {
  return cache.set(readKey(params as DriftReadKeyParams), value);
}
