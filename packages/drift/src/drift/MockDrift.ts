import type { Abi } from "abitype";
import { MockAdapter } from "src/adapter/MockAdapter";
import type { ReadWriteContractStub } from "src/adapter/contract/stubs/ReadWriteContractStub";
import type { CachedReadWriteContract } from "src/contract/CachedContract";
import { Drift, type DriftOptions } from "src/drift/Drift";
import type { SimpleCache } from "src/exports";
import type { ContractParams } from "src/types";

export class MockDrift<TCache extends SimpleCache> extends Drift<
  MockAdapter,
  TCache
> {
  constructor(options?: DriftOptions<TCache>) {
    super(new MockAdapter(), options);
  }

  declare contract: <TAbi extends Abi>(
    params: ContractParams<TAbi>,
  ) => CachedReadWriteContract<TAbi> & ReadWriteContractStub<TAbi>;
}
