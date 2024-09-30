import type { Abi } from "abitype";
import type { Adapter, ReadWriteAdapter } from "src/adapter/types";
import type { EmptyObject } from "src/base/types";
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
  ContractWriteOptions,
} from "src/contract/types/Contract";
import type {
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/contract/types/Function";
import type { TransactionReceipt } from "src/network/types/Transaction";

// Drift Client //

export interface IDrift<
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
> {
  adapter: TAdapter;
  cache: DriftCache<TCache>;
  readonly isReadWrite: TAdapter extends ReadWriteAdapter ? true : false;

  // methods //

  contract: <TAbi extends Abi>(
    params: ContractParams<TAbi>,
  ) => DriftContract<TAbi, TAdapter>;

  read: <TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: DriftReadParams<TAbi, TFunctionName>,
  ) => Promise<FunctionReturn<TAbi, TFunctionName>>;

  write: TAdapter extends ReadWriteAdapter
    ? <
        TAbi extends Abi,
        TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
      >(
        params: DriftWriteParams<TAbi, TFunctionName>,
      ) => Promise<string>
    : undefined;
}

export interface DriftOptions<TCache extends SimpleCache = SimpleCache> {
  cache?: TCache;
}

export class Drift<
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
> implements IDrift<TAdapter, TCache>
{
  readonly adapter: TAdapter;
  cache: DriftCache<TCache>;
  write: TAdapter extends ReadWriteAdapter
    ? <
        TAbi extends Abi,
        TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
      >(
        params: DriftWriteParams<TAbi, TFunctionName>,
      ) => Promise<string>
    : undefined;

  constructor(
    adapter: TAdapter,
    {
      cache = createLruSimpleCache({ max: 500 }) as TCache,
    }: DriftOptions<TCache> = {},
  ) {
    this.adapter = adapter;
    this.cache = createDriftCache(cache, adapter);

    this.write = isReadWriteAdapter(adapter)
      ? async ({ abi, address, fn, args, onMined, ...writeOptions }) => {
          const txHash = await createCachedReadWriteContract({
            contract: adapter.readWriteContract(abi, address),
            cache,
          }).write(fn, args, writeOptions);

          if (onMined) {
            adapter.network.waitForTransaction(txHash).then(onMined);
          }

          return txHash;
        }
      : (undefined as any);
  }

  get isReadWrite(): TAdapter extends ReadWriteAdapter ? true : false {
    return isReadWriteAdapter(this.adapter) as any;
  }

  // Static properties //

  contract = <TAbi extends Abi>({
    abi,
    address,
    cache,
    namespace,
  }: ContractParams<TAbi>): DriftContract<TAbi, TAdapter> =>
    isReadWriteAdapter(this.adapter)
      ? createCachedReadWriteContract({
          contract: this.adapter.readWriteContract(abi, address),
          cache,
          namespace,
        })
      : (createCachedReadContract({
          contract: this.adapter.readContract(abi, address),
          cache,
          namespace,
        }) as DriftContract<TAbi, TAdapter>);

  read = async <TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>({
    abi,
    address,
    fn,
    args,
    ...readOptions
  }: DriftReadParams<TAbi, TFunctionName>): Promise<
    FunctionReturn<TAbi, TFunctionName>
  > => {
    return createCachedReadContract({
      contract: this.adapter.readContract(abi, address),
      cache: this.cache,
    }).read(fn, args, readOptions);
  };
}

export interface ContractParams<TAbi extends Abi = Abi> {
  abi: TAbi;
  address: string;
  cache?: SimpleCache;
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  namespace?: string;
}

export type DriftContract<
  TAbi extends Abi,
  TAdapter extends Adapter = Adapter,
> = TAdapter extends ReadWriteAdapter
  ? CachedReadWriteContract<TAbi>
  : CachedReadContract<TAbi>;

type DriftReadParams<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> = ContractReadOptions & {
  abi: TAbi;
  address: string;
  fn: TFunctionName;
} & (FunctionArgs<TAbi, TFunctionName> extends EmptyObject
    ? {
        args?: FunctionArgs<TAbi, TFunctionName>;
      }
    : {
        args: FunctionArgs<TAbi, TFunctionName>;
      });

type DriftWriteParams<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
> = ContractWriteOptions & {
  abi: TAbi;
  address: string;
  fn: TFunctionName;
  onMined?: (receipt?: TransactionReceipt) => void;
} & (FunctionArgs<TAbi, TFunctionName> extends EmptyObject
    ? {
        args?: FunctionArgs<TAbi, TFunctionName>;
      }
    : {
        args: FunctionArgs<TAbi, TFunctionName>;
      });

function isReadWriteAdapter(adapter: Adapter): adapter is ReadWriteAdapter {
  return "readWriteContract" in adapter;
}

// Drift Cache //

type DriftCache<T extends SimpleCache = SimpleCache> = T & {
  invalidateRead<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: DriftReadParams<TAbi, TFunctionName>,
  ): void;
};

function createDriftCache<T extends SimpleCache>(
  cache: T,
  adapter: Adapter,
): DriftCache<T> {
  const cachePrototype = Object.getPrototypeOf(cache);
  const newCache: T = Object.create(cachePrototype);
  return Object.assign(newCache, cache, {
    invalidateRead<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>({
      abi,
      address,
      args,
      fn,
      ...options
    }: DriftReadParams<TAbi, TFunctionName>) {
      // TODO: Untie cache key schema from factory function to avoid creating a
      // whole contract just to delete a cache entry.
      createCachedReadContract({
        contract: adapter.readContract(abi, address),
        cache,
      }).deleteRead(fn, args, options);
    },
  });
}
