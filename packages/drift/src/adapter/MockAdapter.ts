import type { Abi } from "abitype";
import type { ReadWriteAdapter } from "src/adapter/types";
import { ReadContractStub } from "src/contract/stubs/ReadContractStub";
import { ReadWriteContractStub } from "src/contract/stubs/ReadWriteContractStub";
import { NetworkStub } from "src/network/stubs/NetworkStub";

export class MockAdapter implements ReadWriteAdapter {
  network = new NetworkStub();
  readContract = <TAbi extends Abi>(abi: TAbi) => new ReadContractStub(abi);
  readWriteContract = <TAbi extends Abi>(abi: TAbi) =>
    new ReadWriteContractStub(abi);
}
