import {
  CachedReadWriteContract,
  SimpleCache,
  createCachedReadWriteContract as baseFactory,
} from '@delvtech/evm-client';
import { Abi } from 'abitype';
import {
  ReadWriteContractOptions,
  createReadWriteContract,
} from 'src/contract/createReadWriteContract';

export interface CreateCachedReadWriteContractOptions<TAbi extends Abi = Abi>
  extends ReadWriteContractOptions<TAbi> {
  cache?: SimpleCache;
  namespace?: string;
}

export function createCachedReadWriteContract<TAbi extends Abi = Abi>({
  abi,
  address,
  provider,
  signer,
  readContract,
  cache,
  namespace,
}: CreateCachedReadWriteContractOptions<TAbi>): CachedReadWriteContract<TAbi> {
  return baseFactory({
    contract: createReadWriteContract({
      abi,
      address,
      provider,
      signer,
      readContract,
    }),
    cache,
    namespace,
  });
}
