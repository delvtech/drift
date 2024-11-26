import type { Abi } from "abitype";
import type { Adapter, ReadWriteAdapter } from "src/adapter/types/Adapter";
import type { SimpleCache } from "src/cache/types";
import { BaseClient } from "src/client/BaseClient";
import { Contract, type ContractOptions } from "src/client/contract/Contract";

export class Drift<
  TAdapter extends Adapter = ReadWriteAdapter,
  TCache extends SimpleCache = SimpleCache,
> extends BaseClient<TAdapter, TCache> {
  contract<TAbi extends Abi>({
    abi,
    address,
  }: ContractOptions<TAbi>): Contract<
    TAbi,
    TAdapter,
    TCache,
    Drift<TAdapter, TCache>
  > {
    return new Contract({
      abi,
      address,
      client: this,
    });
  }
}
