import {
  type Abi,
  type DeployParams,
  DriftError,
  encodeBytecodeCallData,
  type FunctionName,
  type GetWalletCapabilitiesParams,
  getWalletCallsStatusLabel,
  type HexString,
  prepareParams,
  type ReadWriteAdapter,
  type SendCallsParams,
  type SendCallsReturn,
  type SendTransactionParams,
  toHexString,
  type WalletCallsStatus,
  type WalletCapabilities,
  type WriteParams,
} from "@delvtech/drift";
import type { AnyClient } from "src/publicClient";
import {
  ViemReadAdapter,
  type ViemReadAdapterParams,
} from "src/ViemReadAdapter";
import type { Call, PublicClient, WalletClient } from "viem";

export interface ViemReadWriteAdapterParams<
  TPublicClient extends AnyClient = AnyClient,
  TWalletClient extends WalletClient = WalletClient,
> extends ViemReadAdapterParams<TPublicClient> {
  walletClient: TWalletClient;
}

export class ViemReadWriteAdapter<
    TPublicClient extends AnyClient = PublicClient,
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

  getWalletCapabilities<TChainIds extends number[]>(
    params?: GetWalletCapabilitiesParams<TChainIds>,
  ): Promise<WalletCapabilities<TChainIds>> {
    const chainId =
      params?.chainId ?? params?.chainIds?.[0] ?? this.walletClient.chain?.id;
    return this.walletClient
      .getCapabilities({
        account: params?.address,
        chainId,
      })
      .then((capabilities) => {
        return {
          // FIXME:
          [chainId || 0]: capabilities,
        } as WalletCapabilities<TChainIds>;
      });
  }

  getCallsStatus<TId extends HexString>(
    batchId: TId,
  ): Promise<WalletCallsStatus<TId>> {
    return this.walletClient
      .getCallsStatus({ id: batchId })
      .then(({ id, status, statusCode, ...rest }) => {
        return {
          id: id as TId,
          statusCode: statusCode,
          status: getWalletCallsStatusLabel(statusCode),
          ...rest,
        };
      });
  }

  showCallsStatus(batchId: HexString): Promise<void> {
    return this.walletClient.showCallsStatus({ id: batchId });
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
      data: params.data,
      to: params.to,
      account: params.from ?? (await this._getAccount()),
      gas: params.gas,
      nonce: params.nonce !== undefined ? Number(params.nonce) : undefined,
      value: params.value,
      chain: this.walletClient.chain,
      type: params.type as any,
      accessList: params.accessList,
      // TODO:
      // blobs: params.blobs,
      // blobVersionedHashes: params.blobVersionedHashes,
      // maxFeePerBlobGas: params.maxFeePerBlobGas,
      ...gasPriceOptions,
    });

    if (params.onMined) {
      this.waitForTransaction({ hash }).then(params.onMined);
    }

    return hash;
  }

  async deploy<TAbi extends Abi>(params: DeployParams<TAbi>) {
    const prepared = prepareParams({
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
      account: params.from ?? (await this._getAccount()),
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

  async write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>) {
    const prepared = prepareParams({
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
      account: params.from ?? (await this._getAccount()),
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

  async sendCalls<const TCalls extends readonly unknown[] = any[]>(
    params: SendCallsParams<TCalls>,
  ): Promise<SendCallsReturn> {
    const { calls, from, ...options } = params;
    return this.walletClient
      .sendCalls({
        calls: calls.map(
          ({ abi, address, args, bytecode, data, fn, to = address, value }) => {
            if (abi && fn) {
              data = this.encodeFunctionData({ abi, fn, args });
            } else if (abi && bytecode) {
              data = this.encodeDeployData({ abi, bytecode, args });
            } else if (bytecode && data) {
              data = encodeBytecodeCallData(bytecode, data);
            }

            return { to, data, value } as Call;
          },
        ),
        account: from ?? (await this._getAccount()),
        ...options,
      })
      .then(({ id, capabilities }) => {
        return {
          id: toHexString(id),
          capabilities,
        } satisfies SendCallsReturn;
      });
  }

  private async _getAccount() {
    return (
      this.walletClient.account ?? this.getSignerAddress().catch(() => null)
    );
  }
}

declare module "@delvtech/drift" {
  interface GetWalletCapabilitiesParams<TChainIds extends number[] = number[]> {
    /**
     *
     * **Important**: Only the first chain ID is used in Viem.
     */
    chainIds?: TChainIds;
    chainId?: number;
  }
}
