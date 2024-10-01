import type { Abi } from "abitype";
import type {
  AdapterReadContract,
  AdapterReadWriteContract,
  ContractReadArgs,
} from "src/adapter/contract/types/Contract";
import type { FunctionName } from "src/adapter/contract/types/Function";
import type { SimpleCache } from "src/exports";
import type { DeepPartial } from "src/utils/types";

export interface CachedReadContract<TAbi extends Abi = Abi>
  extends AdapterReadContract<TAbi> {
  cache: SimpleCache;
  namespace?: string;
  clearCache(): void;
  deleteRead<TFunctionName extends FunctionName<TAbi>>(
    ...[functionName, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ): void;
  deleteReadsMatching<TFunctionName extends FunctionName<TAbi>>(
    ...[functionName, args, options]: DeepPartial<
      ContractReadArgs<TAbi, TFunctionName>
    >
  ): void;
}

export interface CachedReadWriteContract<TAbi extends Abi = Abi>
  extends CachedReadContract<TAbi>,
    AdapterReadWriteContract<TAbi> {}
