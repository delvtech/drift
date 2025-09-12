import {
  type Abi,
  type CallParams,
  type DeployParams,
  DriftError,
  type FunctionName,
  type GetWalletCapabilitiesParams,
  getWalletCallsStatusLabel,
  type HexString,
  NotImplementedError,
  prepareCall,
  prepareParams,
  type ReadWriteAdapter,
  type SendCallsParams,
  type SendCallsReturn,
  type SendTransactionParams,
  type SimulateWriteParams,
  toHexString,
  type WalletCallsReceipt,
  type WalletCallsStatus,
  type WalletCapabilities,
  type WriteParams,
} from "@gud/drift";
import type { ContractTransaction, Signer } from "ethers";
import { Contract, ContractFactory, providers } from "ethers";
import type { AccessList } from "ethers/lib/utils";
import {
  EthersReadAdapter,
  type EthersReadAdapterParams,
} from "src/EthersReadAdapter";
import type { EthersAbi, Provider } from "src/types";

export interface EthersReadWriteAdapterParams<
  TProvider extends Provider = Provider,
  TSigner extends Signer = Signer,
> extends EthersReadAdapterParams<TProvider> {
  signer: TSigner;
}

export class EthersReadWriteAdapter<
    TProvider extends Provider = Provider,
    TSigner extends Signer = Signer,
  >
  extends EthersReadAdapter<TProvider>
  implements ReadWriteAdapter
{
  signer: TSigner;

  constructor({
    provider,
    signer,
  }: EthersReadWriteAdapterParams<TProvider, TSigner>) {
    super({ provider });
    this.signer = signer;
  }

  getSignerAddress() {
    return this.signer.getAddress();
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

  /**
   * @throws A {@linkcode NotImplementedError} if the provider is not a
   * {@linkcode providers.JsonRpcProvider JsonRpcProvider}.
   */
  async getWalletCapabilities<TChainIds extends readonly number[]>({
    address,
    chainIds,
  }: GetWalletCapabilitiesParams<TChainIds> = {}): Promise<
    WalletCapabilities<TChainIds>
  > {
    if (!(this.signer.provider instanceof providers.JsonRpcProvider)) {
      throw new NotImplementedError({
        method: "getWalletCapabilities",
        message: "This method is only available for the JsonRpcProvider.",
      });
    }

    return this.signer.provider
      .send("wallet_getCapabilities", [
        address || (await this.getSignerAddress()),
        chainIds?.map((id) => toHexString(id)) || [
          toHexString(await this.getChainId()),
        ],
      ])
      .then((capabilities) => {
        return Object.fromEntries(
          Object.entries(capabilities).map(([key, value]) => [
            Number(key),
            value,
          ]),
        ) as WalletCapabilities<TChainIds>;
      })
      .catch((e) => {
        throw new DriftError({
          message: "Failed to get wallet capabilities",
          cause: e,
        });
      });
  }

  /**
   * @throws A {@linkcode NotImplementedError} if the provider is not a
   * {@linkcode providers.JsonRpcProvider JsonRpcProvider}.
   */
  async getCallsStatus<TId extends HexString>(
    batchId: TId,
  ): Promise<WalletCallsStatus<TId>> {
    if (!(this.signer.provider instanceof providers.JsonRpcProvider)) {
      throw new NotImplementedError({
        method: "getCallsStatus",
        message: "This method is only available for the JsonRpcProvider.",
      });
    }

    return this.signer.provider
      .send("wallet_getCallsStatus", [batchId])
      .then(
        ({
          chainId,
          id,
          receipts,
          status,
          ...rest
        }: WalletGetCallsStatusReturn) => {
          return {
            chainId: Number(chainId),
            id: id as TId,
            statusCode: status,
            status: getWalletCallsStatusLabel(status),
            receipts: receipts?.map(
              ({ blockNumber, gasUsed, status, ...rest }) => {
                return {
                  blockNumber: BigInt(blockNumber),
                  gasUsed: BigInt(gasUsed),
                  status: status === "0x1" ? "success" : "reverted",
                  ...rest,
                } satisfies WalletCallsReceipt;
              },
            ),
            ...rest,
          };
        },
      )
      .catch((e) => {
        throw new DriftError({
          message: "Failed to get wallet calls status",
          cause: e,
        });
      });
  }

  /**
   * @throws A {@linkcode NotImplementedError} if the provider is not a
   * {@linkcode providers.JsonRpcProvider JsonRpcProvider}.
   */
  showCallsStatus(batchId: HexString): Promise<void> {
    if (!(this.signer.provider instanceof providers.JsonRpcProvider)) {
      throw new NotImplementedError({
        method: "showCallsStatus",
        message: "This method is only available for the JsonRpcProvider.",
      });
    }

    return this.signer.provider
      .send("wallet_showCallsStatus", [batchId])
      .catch((e) => {
        throw new DriftError({
          message: "Failed to show wallet calls status",
          cause: e,
        });
      });
  }

  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: SimulateWriteParams<TAbi, TFunctionName>) {
    return super.simulateWrite({
      ...params,
      from: params.from || (await this.signer.getAddress()),
    });
  }

  async sendTransaction({
    accessList,
    chainId,
    from,
    gas,
    nonce,
    onMined,
    onMinedTimeout,
    type,
    ...rest
  }: SendTransactionParams) {
    const { hash } = await this.signer.sendTransaction({
      accessList: accessList as AccessList,
      chainId: chainId === undefined ? undefined : Number(chainId),
      from: from || (await this.signer.getAddress()),
      gasLimit: gas,
      nonce: nonce === undefined ? undefined : Number(nonce),
      type: type === undefined ? undefined : Number(type),
      ...rest,
    });

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
    bytecode,
    // From address is obtained from the signer
    from,
    gas,
    nonce,
    onMined,
    onMinedTimeout,
    type,
    ...rest
  }: DeployParams<TAbi>) {
    const factory = new ContractFactory(
      abi as EthersAbi,
      bytecode,
      this.signer,
    );
    const { params } = prepareParams({
      abi,
      type: "constructor",
      name: undefined,
      kind: "inputs",
      value: args,
    });
    const contract = await factory.deploy(...params, {
      gasLimit: gas,
      nonce: nonce === undefined ? undefined : Number(nonce),
      type: type === undefined ? undefined : Number(type),
      ...rest,
    });

    const hash = contract.deployTransaction?.hash;
    if (!hash) {
      throw new DriftError("Failed to get deployment transaction hash");
    }

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
    address,
    args,
    fn,
    // From address is obtained from the signer
    from,
    gas,
    nonce,
    onMined,
    onMinedTimeout,
    type,
    ...rest
  }: WriteParams<TAbi, TFunctionName>) {
    const contract = new Contract(address, abi as EthersAbi, this.signer);

    const { params } = prepareParams({
      abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });

    const { hash }: ContractTransaction = await contract[fn](...params, {
      gasLimit: gas,
      nonce: nonce === undefined ? undefined : Number(nonce),
      type: type === undefined ? undefined : Number(type),
      ...rest,
    });

    if (onMined) {
      this.waitForTransaction({
        hash: hash,
        timeout: onMinedTimeout,
      }).then(onMined);
    }

    return hash;
  }

  /**
   * @throws A {@linkcode NotImplementedError} if the provider is not a
   * {@linkcode providers.JsonRpcProvider JsonRpcProvider}.
   */
  async sendCalls<const TCalls extends readonly unknown[] = any[]>({
    calls,
    from,
    chainId,
    atomic,
    version,
    ...rest
  }: SendCallsParams<TCalls>): Promise<SendCallsReturn> {
    if (!(this.signer.provider instanceof providers.JsonRpcProvider)) {
      throw new NotImplementedError({
        method: "sendCalls",
        message: "This method is only available for the JsonRpcProvider.",
      });
    }

    return this.signer.provider
      .send("wallet_sendCalls", [
        {
          version: version || "2.0.0",
          chainId: toHexString(chainId ?? (await this.getChainId())),
          from: from || (await this.getSignerAddress()),
          atomicRequired: atomic ?? true,
          calls: calls.map(({ value, capabilities, ...call }) => {
            const { to, data } = prepareCall(call);
            return {
              to,
              data,
              capabilities,
              value: value ? toHexString(value) : undefined,
            };
          }),
          ...rest,
        },
      ])
      .catch((e) => {
        throw new DriftError({
          message: "Failed to send wallet calls",
          cause: e,
        });
      });
  }
}

interface WalletGetCallsStatusReturn {
  atomic: boolean;
  capabilities?: WalletCapabilities | undefined;
  chainId: HexString;
  id: string;
  receipts?: {
    status: HexString;
    blockHash: HexString;
    blockNumber: HexString;
    gasUsed: HexString;
    transactionHash: HexString;
  }[];
  status: number;
  version: string;
}
