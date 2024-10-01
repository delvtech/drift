import type { Abi } from "abitype";
import type {
  ContractReadArgs,
  ReadContract,
  ReadWriteContract,
} from "src/contract/types/Contract";
import type { FunctionName } from "src/contract/types/Function";
import type { SimpleCache } from "src/exports";
import type { DeepPartial } from "src/utils/types";

export interface CachedReadContract<TAbi extends Abi = Abi>
  extends ReadContract<TAbi> {
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
    ReadWriteContract<TAbi> {}
