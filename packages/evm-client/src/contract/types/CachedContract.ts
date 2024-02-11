import { Abi } from 'abitype';
import {
  ContractReadArgs,
  ReadContract,
  ReadWriteContract,
} from 'src/contract/types/Contract';
import { FunctionName } from 'src/contract/types/Function';

export interface CachedReadContract<TAbi extends Abi = Abi>
  extends ReadContract<TAbi> {
  namespace?: string;
  clearCache(): void;
  deleteRead<TFunctionName extends FunctionName<TAbi>>(
    ...[functionName, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ): void;
}

export interface CachedReadWriteContract<TAbi extends Abi = Abi>
  extends CachedReadContract<TAbi>,
    ReadWriteContract<TAbi> {}
