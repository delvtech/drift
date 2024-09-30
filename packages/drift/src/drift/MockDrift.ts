import type { Abi } from "abitype";
import { MockAdapter } from "src/adapter/MockAdapter";
import type { ReadWriteContractStub } from "src/contract/stubs/ReadWriteContractStub";
import type { CachedReadWriteContract } from "src/contract/types/CachedContract";
import { type ContractParams, Drift } from "src/drift/Drift";

export class MockDrift extends Drift<MockAdapter> {
  constructor() {
    super(new MockAdapter());
  }

  declare contract: <TAbi extends Abi>(
    params: ContractParams<TAbi>,
  ) => CachedReadWriteContract<TAbi> & ReadWriteContractStub<TAbi>;
}
