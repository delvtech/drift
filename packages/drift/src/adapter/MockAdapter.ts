import type { Abi } from "abitype";
import { ReadContractStub } from "src/adapter/contract/stubs/ReadContractStub";
import { ReadWriteContractStub } from "src/adapter/contract/stubs/ReadWriteContractStub";
import { MockNetwork } from "src/adapter/network/MockNetwork";
import type { ReadWriteAdapter } from "src/adapter/types";

export class MockAdapter implements ReadWriteAdapter {
  network = new MockNetwork();
  getSignerAddress = async () => "0xMockSigner";
  readContract = <TAbi extends Abi>(abi: TAbi) => new ReadContractStub(abi);
  readWriteContract = <TAbi extends Abi>(abi: TAbi) =>
    new ReadWriteContractStub(abi);
}
