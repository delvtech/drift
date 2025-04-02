import {
  type Abi,
  type DeployParams,
  DriftError,
  type FunctionName,
  type ReadWriteAdapter,
  type SendTransactionParams,
  type SimulateWriteParams,
  type WriteParams,
  prepareParamsArray,
} from "@delvtech/drift";
import {
  ViemReadAdapter,
  type ViemReadAdapterParams,
} from "src/ViemReadAdapter";
import type { PublicClient, WalletClient } from "viem";

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
    if (!address) throw new DriftError("No signer address found");
    return address;
  }

  async sendTransaction(params: SendTransactionParams) {
    const gasPriceOptions =
      params.gasPrice !== undefined
        ? {
            gasPrice: params.gasPrice,
          }
        : {
            maxFeePerGas: params.maxFeePerGas,
            maxPriorityFeePerGas: params.maxPriorityFeePerGas,
          };

    const hash = await this.walletClient.sendTransaction({
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

  async deploy<TAbi extends Abi>(params: DeployParams<TAbi>) {
    const prepared = prepareParamsArray({
      abi: params.abi,
      type: "constructor",
      name: undefined,
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

    const hash = await this.walletClient.deployContract({
      abi: params.abi as Abi,
      bytecode: params.bytecode,
      args: prepared.params,
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

  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: SimulateWriteParams<TAbi, TFunctionName>) {
    return super.simulateWrite({
      ...params,
      from: params.from ?? (await this.getSignerAddress()),
    });
  }

  async write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>) {
    const prepared = prepareParamsArray({
      abi: params.abi,
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
      args: prepared.params,
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
