import type {
  AdapterWriteParams,
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

  getSignerAddress = () => {
    return this.walletClient.getAddresses().then(([address]) => address!);
  };

  // override to get the account from the wallet client
  simulateWrite = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: AdapterWriteParams<TAbi, TFunctionName>,
  ) => {
    return this.getSignerAddress().then((from) => {
      const viemParams = createSimulateContractParameters(
        Object.assign({}, params, { from }),
      );
      return this.publicClient
        .simulateContract(viemParams)
        .then(({ result }) => {
          return outputToFriendly({
            abi: params.abi,
            functionName: params.fn,
            output: result,
          }) as FunctionReturn<TAbi, TFunctionName>;
        });
    });
  };

  write = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: AdapterWriteParams<TAbi, TFunctionName>,
  ) => {
    const writePromise = this.getSignerAddress().then((from) => {
      const viemParams = createSimulateContractParameters(
        Object.assign({}, params, { from }),
      );
      return this.publicClient
        .simulateContract(viemParams)
        .then(({ request }) =>
          this.walletClient.writeContract(request as WriteContractParameters),
        );
    });

    if (params.onMined) {
      writePromise.then((hash) => {
        this.waitForTransaction({ hash }).then(params.onMined);
        return hash;
      });
    }

    return writePromise;
  };
}
