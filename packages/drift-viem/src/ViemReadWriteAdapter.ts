import type {
  Address,
  FunctionName,
  FunctionReturn,
  ReadWriteAdapter,
  WriteParams,
} from "@delvtech/drift";
import {
  ViemReadAdapter,
  type ViemReadAdapterParams,
} from "src/ViemReadAdapter";
import { createSimulateContractParameters } from "src/utils/createSimulateContractParameters";
import { outputToFriendly } from "src/utils/outputToFriendly";
import type {
  Abi,
  PublicClient,
  WalletClient,
  WriteContractParameters,
} from "viem";

export interface ViemReadWriteAdapterParams<
  TPublicClient extends PublicClient = PublicClient,
  TWalletClient extends WalletClient = WalletClient,
> extends ViemReadAdapterParams<TPublicClient> {
  walletClient: TWalletClient;
}

export class ViemReadWriteAdapter<
    TPublicClient extends PublicClient = PublicClient,
    TWalletClient extends WalletClient = WalletClient,
  >
  extends ViemReadAdapter<TPublicClient>
  implements ReadWriteAdapter
{
  walletClient: TWalletClient;

  constructor({
    walletClient,
    ...rest
  }: ViemReadWriteAdapterParams<TPublicClient, TWalletClient>) {
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
  >(params: WriteParams<TAbi, TFunctionName>) {
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
  >(params: WriteParams<TAbi, TFunctionName>) {
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
