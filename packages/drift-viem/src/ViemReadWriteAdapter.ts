import type {
  AdapterWriteParams,
  Address,
  FunctionName,
  FunctionReturn,
  ReadWriteAdapter,
} from "@delvtech/drift";
import {
  ViemReadAdapter,
  type ViemReadAdapterParams,
} from "src/ViemReadAdapter";
import { createSimulateContractParameters } from "src/utils/createSimulateContractParameters";
import { outputToFriendly } from "src/utils/outputToFriendly";
import type { Abi, WalletClient, WriteContractParameters } from "viem";

export interface ViemReadWriteAdapterParams extends ViemReadAdapterParams {
  walletClient: WalletClient;
}

export class ViemReadWriteAdapter
  extends ViemReadAdapter
  implements ReadWriteAdapter
{
  walletClient: WalletClient;

  constructor({ walletClient, ...rest }: ViemReadWriteAdapterParams) {
    super(rest);
    this.walletClient = walletClient;
  }

  async getSignerAddress() {
    const [address] = await this.walletClient.getAddresses();
    return address as Address;
  }

  // override to get the account from the wallet client
  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: AdapterWriteParams<TAbi, TFunctionName>) {
    const viemParams = createSimulateContractParameters(
      Object.assign({}, params, {
        from: params.from || (await this.getSignerAddress()),
      }),
    );
    const { result } = await this.publicClient.simulateContract(viemParams);

    return outputToFriendly({
      abi: params.abi,
      functionName: params.fn,
      output: result,
    }) as FunctionReturn<TAbi, TFunctionName>;
  }

  async write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: AdapterWriteParams<TAbi, TFunctionName>) {
    const viemParams = createSimulateContractParameters(
      Object.assign({}, params, {
        from: params.from || (await this.getSignerAddress()),
      }),
    );
    const writePromise = this.publicClient
      .simulateContract(viemParams)
      .then(({ request }) =>
        this.walletClient.writeContract(request as WriteContractParameters),
      );

    if (params.onMined) {
      writePromise.then((hash) => {
        this.waitForTransaction({ hash }).then(params.onMined);
        return hash;
      });
    }

    return writePromise;
  }
}
