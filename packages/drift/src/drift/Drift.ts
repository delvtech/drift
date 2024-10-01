import type { Abi } from "abitype";
import type { Adapter, ReadWriteAdapter } from "src/adapter/types";
import type { SimpleCache } from "src/cache/types/SimpleCache";
import { createCachedReadContract } from "src/contract/factories/createCachedReadContract";
import { createCachedReadWriteContract } from "src/contract/factories/createCachedReadWriteContract";
import type { FunctionName, FunctionReturn } from "src/contract/types/Function";
import { type DriftCache, createDriftCache } from "src/drift/DriftCache";
import type {
  DriftContract,
  DriftContractParams,
  DriftReadParams,
  DriftWriteParams,
} from "src/drift/types";

export interface DriftOptions<TCache extends SimpleCache = SimpleCache> {
  cache?: TCache;
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  namespace?: string;
}

// This is the one place where the Read/ReadWrite distinction is skipped in
// favor of a unified entrypoint to the Drift API.
export class Drift<
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
> {
  readonly adapter: TAdapter;
  cache: DriftCache<TCache>;
  namespace?: string;
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
    { cache, namespace }: DriftOptions<TCache> = {},
  ) {
    this.adapter = adapter;
    this.cache = createDriftCache(cache);
    this.namespace = namespace;
    this.write = this.isReadWrite()
      ? async ({ abi, address, fn, args, onMined, ...writeOptions }) => {
          if (isReadWriteAdapter(this.adapter)) {
            const txHash = await createCachedReadWriteContract({
              contract: this.adapter.readWriteContract(abi, address),
              cache: this.cache,
            }).write(fn, args, writeOptions);

            if (onMined) {
              this.adapter.network.waitForTransaction(txHash).then(onMined);
            }

            return txHash;
          }
        }
      : (undefined as any);
  }

  isReadWrite = (): this is Drift<ReadWriteAdapter, TCache> =>
    isReadWriteAdapter(this.adapter);

  contract = <TAbi extends Abi>({
    abi,
    address,
    cache = this.cache,
    namespace = this.namespace,
  }: DriftContractParams<TAbi>): DriftContract<TAbi, TAdapter> =>
    this.isReadWrite()
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

  read = async <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >({
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

function isReadWriteAdapter(adapter: Adapter): adapter is ReadWriteAdapter {
  return "readWriteContract" in adapter;
}
