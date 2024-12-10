import {
  type FunctionName,
  type FunctionReturn,
  type ReadWriteAdapter,
  type WriteParams,
  objectToArray,
} from "@delvtech/drift";
import {
  ViemReadAdapter,
  type ViemReadAdapterParams,
} from "src/ViemReadAdapter";
import { outputToFriendly } from "src/utils/outputToFriendly";
import type { Abi, Address, PublicClient, WalletClient } from "viem";

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
    const argsArray = objectToArray({
      abi: params.abi as Abi,
      type: "function",
      name: params.fn,
      kind: "inputs",
      value: params.args,
    });

    const gasPriceOptions =
      params.gasPrice !== undefined
        ? {
            gasPrice: params.gasPrice,
          }
        : {
            maxFeePerGas: params.maxFeePerGas,
            maxPriorityFeePerGas: params.maxPriorityFeePerGas,
          };

    const { result } = await this.publicClient.simulateContract({
      abi: params.abi as Abi,
      address: params.address,
      functionName: params.fn,
      args: argsArray,
      accessList: params.accessList,
      account: params.from ?? (await this.getSignerAddress()) ?? null,
      gas: params.gas,
      nonce: params.nonce !== undefined ? Number(params.nonce) : undefined,
      value: params.value,
      chain: this.walletClient.chain,
      type: params.type as any,
      ...gasPriceOptions,
    });

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
    const argsArray = objectToArray({
      abi: params.abi as Abi,
      type: "function",
      name: params.fn,
      kind: "inputs",
      value: params.args,
    });

    const gasPriceOptions =
      params.gasPrice !== undefined
        ? {
            gasPrice: params.gasPrice,
          }
        : {
            maxFeePerGas: params.maxFeePerGas,
            maxPriorityFeePerGas: params.maxPriorityFeePerGas,
          };

    const hash = await this.walletClient.writeContract({
      abi: params.abi as Abi,
      address: params.address,
      functionName: params.fn,
      args: argsArray,
      accessList: params.accessList,
      account: params.from ?? (await this.getSignerAddress()) ?? null,
      gas: params.gas,
      nonce: params.nonce !== undefined ? Number(params.nonce) : undefined,
      value: params.value,
      chain: this.walletClient.chain,
      type: params.type as any,
      ...gasPriceOptions,
    });

    if (params.onMined) {
      this.waitForTransaction({ hash }).then(params.onMined);
    }

    return hash;
  }
}
