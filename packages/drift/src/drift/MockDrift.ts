import type { Abi } from "abitype";
import { MockAdapter } from "src/adapter/MockAdapter";
import type { ReadWriteContractStub } from "src/adapter/contract/mocks/ReadWriteContractStub";
import type { ReadWriteContract } from "src/contract/types";
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
  ) => ReadWriteContract<TAbi> & ReadWriteContractStub<TAbi>;
}
