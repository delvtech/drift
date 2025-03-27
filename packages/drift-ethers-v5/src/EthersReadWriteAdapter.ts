import {
  type Abi,
  type DeployParams,
  DriftError,
  type FunctionName,
  type ReadWriteAdapter,
  type SimulateWriteParams,
  type TransactionReceipt,
  type WriteParams,
  prepareParamsArray,
} from "@delvtech/drift";
import type { ContractTransaction, Signer } from "ethers";
import { Contract, ContractFactory } from "ethers";
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

  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: SimulateWriteParams<TAbi, TFunctionName>) {
    return super.simulateWrite({
      ...params,
      from: params.from ?? (await this.signer.getAddress()),
    });
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
    const contract = new Contract(address, abi as EthersAbi, this.signer);

    const { params } = prepareParamsArray({
      abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });

    const tx: ContractTransaction = await contract[fn](...params, {
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
      tx.wait().then((ethersReceipt) => {
        const receipt: TransactionReceipt = {
          blockHash: ethersReceipt.blockHash,
          blockNumber: BigInt(ethersReceipt.blockNumber),
          cumulativeGasUsed: ethersReceipt.cumulativeGasUsed.toBigInt(),
          gasUsed: ethersReceipt.gasUsed.toBigInt(),
          effectiveGasPrice: ethersReceipt.effectiveGasPrice.toBigInt(),
          from: ethersReceipt.from,
          logsBloom: ethersReceipt.logsBloom,
          status: ethersReceipt.status ? "success" : "reverted",
          to: ethersReceipt.to,
          transactionHash: ethersReceipt.transactionHash,
          transactionIndex: BigInt(ethersReceipt.transactionIndex),
        };
        onMined(receipt);
      });
    }

    return tx.hash;
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
      abi as EthersAbi,
      bytecode,
      this.signer,
    );
    const { params } = prepareParamsArray({
      abi,
      type: "constructor",
      name: undefined,
      kind: "inputs",
      value: args,
    });
    const contract = await factory.deploy(...params, {
      accessList: options.accessList,
      chainId: options.chainId,
      // from: from ?? (await this.signer.getAddress()),
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
        const hash = deployedContract.deployTransaction?.hash;
        if (hash) {
          const minedTransaction = await this.waitForTransaction({ hash });
          onMined(minedTransaction);
        }
      })();
    }

    const hash = contract.deployTransaction?.hash;
    if (!hash) {
      throw new DriftError("Failed to get deployment transaction hash");
    }
    return hash;
  }
}
