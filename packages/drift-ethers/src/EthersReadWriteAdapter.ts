import {
  type Abi,
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
  toHexString,
  type WalletCallsReceipt,
  type WalletCallsStatus,
  type WalletCapabilities,
  type WriteParams,
} from "@delvtech/drift";
import {
  type AccessList,
  BrowserProvider,
  Contract,
  ContractFactory,
  type InterfaceAbi,
  JsonRpcProvider,
  type Provider,
  type Signer,
} from "ethers";
import {
  EthersReadAdapter,
  type EthersReadAdapterParams,
} from "src/EthersReadAdapter";

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

  /**
   * @throws A {@linkcode NotImplementedError} if the provider is not a
   * {@linkcode JsonRpcProvider} or {@linkcode BrowserProvider}.
   */
  async getWalletCapabilities<TChainIds extends readonly number[]>(
    params?: GetWalletCapabilitiesParams<TChainIds>,
  ): Promise<WalletCapabilities<TChainIds>> {
    if (
      !(
        this.signer.provider instanceof JsonRpcProvider ||
        this.signer.provider instanceof BrowserProvider
      )
    ) {
      throw new NotImplementedError({
        method: "getWalletCapabilities",
        message:
          "This method is only available for the JsonRpcProvider and BrowserProvider.",
      });
    }

    return this.signer.provider
      .send("wallet_getCapabilities", [
        params?.address || (await this.getSignerAddress()),
        params?.chainIds?.map((id) => toHexString(id)) || [
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
   * {@linkcode JsonRpcProvider} or {@linkcode BrowserProvider}.
   */
  async getCallsStatus<TId extends HexString>(
    batchId: TId,
  ): Promise<WalletCallsStatus<TId>> {
    if (
      !(
        this.signer.provider instanceof JsonRpcProvider ||
        this.signer.provider instanceof BrowserProvider
      )
    ) {
      throw new NotImplementedError({
        method: "getCallsStatus",
        message:
          "This method is only available for the JsonRpcProvider and BrowserProvider.",
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
   * {@linkcode JsonRpcProvider} or {@linkcode BrowserProvider}.
   */
  showCallsStatus(batchId: HexString): Promise<void> {
    if (
      !(
        this.signer.provider instanceof JsonRpcProvider ||
        this.signer.provider instanceof BrowserProvider
      )
    ) {
      throw new NotImplementedError({
        method: "showCallsStatus",
        message:
          "This method is only available for the JsonRpcProvider and BrowserProvider.",
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

  async sendTransaction({
    data,
    to,
    from,
    onMined,
    ...options
  }: SendTransactionParams) {
    const { hash } = await this.signer.sendTransaction({
      data,
      to,
      accessList: options.accessList as AccessList,
      chainId: options.chainId,
      from: from ?? (await this.signer.getAddress()),
      gasLimit: options.gas,
      blobs: options.blobs as string[],
      blobVersionedHashes: options.blobVersionedHashes as string[],
      maxFeePerBlobGas: options.maxFeePerBlobGas,
      gasPrice: options.gasPrice,
      maxFeePerGas: options.maxFeePerGas,
      maxPriorityFeePerGas: options.maxPriorityFeePerGas,
      nonce: options.nonce ? Number(options.nonce) : undefined,
      type: options.type ? Number(options.type) : undefined,
      value: options.value,
    });

    if (onMined) this.waitForTransaction({ hash }).then(onMined);

    return hash;
  }

  async deploy<TAbi extends Abi>({
    abi,
    args,
    bytecode,
    from,
    onMined,
    ...options
  }: DeployParams<TAbi>) {
    const factory = new ContractFactory(
      abi as InterfaceAbi,
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
      accessList: options.accessList,
      chainId: options.chainId,
      from: from ?? (await this.signer.getAddress()),
      gasLimit: options.gas,
      gasPrice: options.gasPrice,
      maxFeePerGas: options.maxFeePerGas,
      maxPriorityFeePerGas: options.maxPriorityFeePerGas,
      nonce: options.nonce ? Number(options.nonce) : undefined,
      type: options.type ? Number(options.type) : undefined,
      value: options.value,
    });

    if (onMined) {
      (async () => {
        const deployedContract = await contract.waitForDeployment();
        const transaction = deployedContract.deploymentTransaction();
        const hash = transaction?.hash;
        if (hash) {
          const minedTransaction = await this.waitForTransaction({ hash });
          onMined(minedTransaction);
        }
      })();
    }

    const hash = contract.deploymentTransaction()?.hash;
    if (!hash) {
      throw new DriftError("Failed to get deployment transaction hash");
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
    from,
    onMined,
    ...options
  }: WriteParams<TAbi, TFunctionName>) {
    const contract = new Contract(address, abi as InterfaceAbi, this.signer);

    const { params } = prepareParams({
      abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });

    const { hash } = await contract.getFunction(fn)(...params, {
      accessList: options.accessList,
      chainId: options.chainId,
      from: from ?? (await this.signer.getAddress()),
      gasLimit: options.gas,
      gasPrice: options.gasPrice,
      maxFeePerGas: options.maxFeePerGas,
      maxPriorityFeePerGas: options.maxPriorityFeePerGas,
      nonce: options.nonce ? Number(options.nonce) : undefined,
      type: options.type ? Number(options.type) : undefined,
      value: options.value,
    });

    if (onMined) this.waitForTransaction({ hash }).then(onMined);

    return hash;
  }

  /**
   * @throws A {@linkcode NotImplementedError} if the provider is not a
   * {@linkcode JsonRpcProvider} or {@linkcode BrowserProvider}.
   */
  async sendCalls<const TCalls extends readonly unknown[] = any[]>(
    params: SendCallsParams<TCalls>,
  ): Promise<SendCallsReturn> {
    if (
      !(
        this.signer.provider instanceof JsonRpcProvider ||
        this.signer.provider instanceof BrowserProvider
      )
    ) {
      throw new NotImplementedError({
        method: "sendCalls",
        message:
          "This method is only available for the JsonRpcProvider and BrowserProvider.",
      });
    }

    return this.signer.provider
      .send("wallet_sendCalls", [
        {
          version: params.version || "2.0.0",
          id: params.id,
          chainId: toHexString(params.chainId ?? (await this.getChainId())),
          from: params.from ?? (await this.getSignerAddress()),
          atomicRequired: params.atomic ?? true,
          calls: params.calls.map(({ value, capabilities, ...call }) => {
            const { to, data } = prepareCall(call);
            return {
              to,
              data,
              capabilities,
              value: value ? toHexString(value) : undefined,
            };
          }),
          capabilities: params.capabilities,
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
  receipts?: readonly {
    status: HexString;
    blockHash: HexString;
    blockNumber: HexString;
    gasUsed: HexString;
    transactionHash: HexString;
  }[];
  status: number;
  version: string;
}
