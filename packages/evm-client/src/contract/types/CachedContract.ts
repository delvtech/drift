import { Abi } from 'abitype';
import {
  ContractReadArgs,
  ContractReadOptions,
  ReadContract,
  ReadWriteContract,
} from 'src/contract/types/Contract';
import { FunctionArgs, FunctionName } from 'src/contract/types/Function';
import { SimpleCache } from 'src/exports';

interface DeleteReadOptionsObj<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> {
  functionName: TFunctionName;
  args: FunctionArgs<TAbi, TFunctionName>;
  options: ContractReadOptions;
  partialMatch?: boolean;
}

export interface CachedReadContract<TAbi extends Abi = Abi>
  extends ReadContract<TAbi> {
  cache: SimpleCache;
  namespace?: string;
  clearCache(): void;
  deleteRead<TFunctionName extends FunctionName<TAbi>>(
    ...[functionName, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ): void;
  deleteReadMatch<TFunctionName extends FunctionName<TAbi>>(
    ...[functionName, args, options]: DeepPartial<
      ContractReadArgs<TAbi, TFunctionName>
    >
  ): void;
}

export interface CachedReadWriteContract<TAbi extends Abi = Abi>
  extends CachedReadContract<TAbi>,
    ReadWriteContract<TAbi> {}



type DeepPartial<T> = Partial<{
  [K in keyof T]: DeepPartial<T[K]>;
}>;