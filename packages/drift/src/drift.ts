import type { Abi } from "abitype";
import { createLruSimpleCache } from "src/cache/factories/createLruSimpleCache";
import type { SimpleCache } from "src/cache/types/SimpleCache";
import { createCachedReadContract } from "src/contract/factories/createCachedReadContract";
import { createCachedReadWriteContract } from "src/contract/factories/createCachedReadWriteContract";
import type {
  CachedReadContract,
  CachedReadWriteContract,
} from "src/contract/types/CachedContract";
import type {
  ContractReadOptions,
  ReadContract,
  ReadWriteContract,
} from "src/contract/types/Contract";
import type { FunctionArgs, FunctionName } from "src/contract/types/Function";
import type { Network } from "src/network/types/Network";

export interface ReadAdapter {
  network: Network;
  createReadContract<TAbi extends Abi>(options: {
    abi: TAbi;
    address: string;
  }): ReadContract<TAbi>;
}

export interface ReadWriteAdapter extends ReadAdapter {
  createReadWriteContract<TAbi extends Abi>(options: {
    abi: TAbi;
    address: string;
  }): ReadWriteContract<TAbi>;
}

export class Drift<TAdapter extends ReadAdapter | ReadWriteAdapter> {
  adapter: TAdapter;
  cache: DriftCache;

  constructor(
    adapter: TAdapter,
    {
      cache = createLruSimpleCache({ max: 500 }),
    }: {
      cache?: SimpleCache;
    } = {},
  ) {
    this.adapter = adapter;
    this.cache = createDriftCache(cache, adapter);
  }

  contract<TAbi extends Abi>({
    abi,
    address,
    cache,
    namespace,
  }: ContractOptions<TAbi>): DriftContract<TAbi, TAdapter> {
    if (isReadWriteAdapter(this.adapter)) {
      return createCachedReadWriteContract({
        contract: this.adapter.createReadWriteContract({ abi, address }),
        cache,
        namespace,
      });
    }

    return createCachedReadContract({
      contract: this.adapter.createReadContract({ abi, address }),
      cache,
      namespace,
    }) as DriftContract<TAbi, TAdapter>;
  }
}

export type DriftContract<
  TAbi extends Abi,
  TAdapter extends ReadAdapter | ReadWriteAdapter = ReadAdapter,
> = TAdapter extends ReadWriteAdapter
  ? CachedReadWriteContract<TAbi>
  : CachedReadContract<TAbi>;

function isReadWriteAdapter(
  adapter: ReadAdapter | ReadWriteAdapter,
): adapter is ReadWriteAdapter {
  return "createReadWriteContract" in adapter;
}

export interface ContractOptions<TAbi extends Abi = Abi> {
  abi: TAbi;
  address: string;
  cache?: SimpleCache;
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  namespace?: string;
}

interface DriftCache extends SimpleCache {
  invalidateRead<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: DriftReadParams<TAbi, TFunctionName>,
  ): void;
}

function createDriftCache(
  cache: SimpleCache,
  adapter: ReadAdapter,
): DriftCache {
  const cachePrototype = Object.getPrototypeOf(cache);
  const newCache: SimpleCache = Object.create(cachePrototype);
  return Object.assign(newCache, cache, {
    invalidateRead<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>({
      abi,
      address,
      args,
      fn,
      ...options
    }: DriftReadParams<TAbi, TFunctionName>) {
      const contract = createCachedReadContract({
        contract: adapter.createReadContract({
          abi,
          address,
        }),
        cache,
      });

      contract.deleteRead(fn, args, options);
    },
  });
}

type DriftReadParams<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> = {
  abi: TAbi;
  address: string;
  fn: TFunctionName;
  args: FunctionArgs<TAbi, TFunctionName>;
} & ContractReadOptions;
