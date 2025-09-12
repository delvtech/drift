import {
  type Abi,
  type CallParams,
  type DeployParams,
  DriftError,
  type FunctionName,
  type GetWalletCapabilitiesParams,
  getWalletCallsStatusLabel,
  type HexString,
  prepareCall,
  prepareParams,
  type ReadWriteAdapter,
  type SendCallsParams,
  type SendCallsReturn,
  type SendTransactionParams,
  toHexString,
  type WalletCallsStatus,
  type WalletCapabilities,
  type WriteParams,
} from "@gud/drift";
import type { AnyClient } from "src/publicClient";
import {
  ViemReadAdapter,
  type ViemReadAdapterParams,
} from "src/ViemReadAdapter";
import type {
  Call,
  DeployContractParameters,
  PublicClient,
  SendTransactionParameters,
  WalletClient,
  WriteContractParameters,
} from "viem";

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
    if (this.walletClient.account) {
      return this.walletClient.account.address;
    }
    const [address] = await this.walletClient.getAddresses();
    if (!address) {
      throw new DriftError("No signer address found");
    }
    return address;
  }

  async call({ from, ...rest }: CallParams) {
    return super.call({
      from: from || (await this.getSignerAddress().catch(() => undefined)),
      ...rest,
    });
  }

  async estimateGas({ from, ...rest }: CallParams) {
    return super.estimateGas({
      from: from || (await this.getSignerAddress().catch(() => undefined)),
      ...rest,
    });
  }

  getWalletCapabilities<TChainIds extends readonly number[]>({
    address,
    chainId,
    chainIds,
  }: GetWalletCapabilitiesParams<TChainIds> = {}): Promise<
    WalletCapabilities<TChainIds>
  > {
    const _chainId = chainId ?? chainIds?.[0] ?? this.walletClient.chain?.id;
    return this.walletClient
      .getCapabilities({
        account: address,
        chainId: _chainId,
      })
      .then((capabilities) => {
        return {
          // FIXME:
          [_chainId || 0]: capabilities,
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

  async sendTransaction({
    chainId,
    from,
    nonce,
    onMined,
    onMinedTimeout,
    ...rest
  }: SendTransactionParams) {
    const hash = await this.walletClient.sendTransaction({
      account: from || (await this._getAccount()),
      nonce: nonce !== undefined ? Number(nonce) : undefined,
      chain: this.walletClient.chain,
      ...rest,
    } as SendTransactionParameters);

    if (onMined) {
      this.waitForTransaction({
        hash,
        timeout: onMinedTimeout,
      }).then(onMined);
    }

    return hash;
  }

  async deploy<TAbi extends Abi>({
    abi,
    args,
    chainId,
    from,
    nonce,
    onMined,
    onMinedTimeout,
    ...rest
  }: DeployParams<TAbi>) {
    const { params } = prepareParams({
      abi,
      type: "constructor",
      name: undefined,
      kind: "inputs",
      value: args,
    });

    const hash = await this.walletClient.deployContract({
      abi,
      args: params,
      account: from || (await this._getAccount()),
      nonce: nonce !== undefined ? Number(nonce) : undefined,
      chain: this.walletClient.chain,
      ...rest,
    } as DeployContractParameters);

    if (onMined) {
      this.waitForTransaction({
        hash,
        timeout: onMinedTimeout,
      }).then(onMined);
    }

    return hash;
  }

  async write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >({
    abi,
    args,
    chainId,
    fn,
    from,
    nonce,
    onMined,
    onMinedTimeout,
    ...rest
  }: WriteParams<TAbi, TFunctionName>) {
    const { params } = prepareParams({
      abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });

    const hash = await this.walletClient.writeContract({
      abi: abi as Abi,
      functionName: fn,
      args: params,
      account: from || (await this._getAccount()),
      nonce: nonce !== undefined ? Number(nonce) : undefined,
      chain: this.walletClient.chain,
      ...rest,
    } as WriteContractParameters);

    if (onMined) {
      this.waitForTransaction({
        hash,
        timeout: onMinedTimeout,
      }).then(onMined);
    }

    return hash;
  }

  async sendCalls<const TCalls extends readonly unknown[] = any[]>({
    calls,
    from,
    ...rest
  }: SendCallsParams<TCalls>): Promise<SendCallsReturn> {
    return this.walletClient
      .sendCalls({
        account: from ?? (await this._getAccount()),
        calls: calls.map(({ value, capabilities, ...call }) => {
          const { to, data } = prepareCall(call);
          return { to, data, value } as Call;
        }),
        ...rest,
      })
      .then(({ id, capabilities }) => {
        return {
          id: toHexString(id),
          capabilities,
        } satisfies SendCallsReturn;
      });
  }

  private async _getAccount() {
    if (this.walletClient.account) {
      return this.walletClient.account;
    }
    const [address] = await this.walletClient.getAddresses();
    return address || null;
  }
}

declare module "@gud/drift" {
  interface GetWalletCapabilitiesParams<
    TChainIds extends readonly number[] = number[],
  > {
    /**
     *
     * **Important**: Only the first chain ID is used in Viem.
     */
    chainIds?: TChainIds;
    chainId?: number;
  }
}
