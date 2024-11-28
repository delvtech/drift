import type { Abi } from "abitype";
import type { MockAdapter } from "src/adapter/MockAdapter";
import type { SimpleCache } from "src/cache/types";
import { MockClient } from "src/client/MockClient";
import type { ContractOptions } from "src/client/contract/Contract";
import { MockContract } from "src/client/contract/MockContract";
import type { Drift } from "src/client/drift/Drift";
import { ZERO_ADDRESS } from "src/constants";

export class MockDrift<
    TAdapter extends MockAdapter = MockAdapter,
    TCache extends SimpleCache = SimpleCache,
  >
  extends MockClient<TAdapter, TCache>
  implements Drift<TAdapter, TCache>
{
  contract<TAbi extends Abi>({
    abi,
    address = ZERO_ADDRESS,
  }: ContractOptions<TAbi>) {
    return new MockContract<
      TAbi,
      TAdapter,
      TCache,
      MockDrift<TAdapter, TCache>
    >({
      abi,
      address,
      client: this,
    });
  }
}
