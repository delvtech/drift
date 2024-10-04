import type { Abi } from "abitype";
import { MockAdapter } from "src/adapter/MockAdapter";
import type { ReadWriteContractStub } from "src/adapter/contract/mocks/ReadWriteContractStub";
import type { SimpleCache } from "src/cache/simple-cache/types";
import type { ReadWriteContract } from "src/client/Contract/Contract";
import { Drift, type DriftOptions } from "src/client/Drift/Drift";

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
