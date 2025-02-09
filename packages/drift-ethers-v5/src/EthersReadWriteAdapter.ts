import {
  type Abi,
  type Address,
  type FunctionName,
  type Hash,
  type HexString,
  type ReadWriteAdapter,
  type TransactionReceipt,
  type WriteParams,
  objectToArray,
} from "@delvtech/drift";
import type { ContractTransaction, Signer } from "ethers";
import { Contract } from "ethers";
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
    return this.signer.getAddress() as Promise<HexString>;
  }

  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>) {
    return super.simulateWrite({
      ...params,
      from: params.from ?? (await this.signer.getAddress()),
    } as WriteParams<TAbi, TFunctionName>);
  }

  async write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>) {
    const {
      abi,
      address,
      args,
      fn,
      from = await this.signer.getAddress(),
      onMined,
      ...options
    } = params;
    const contract = new Contract(address, abi as EthersAbi, this.signer);

    const arrayArgs = objectToArray({
      abi: abi as Abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });

    const tx: ContractTransaction = await contract[fn](...arrayArgs, {
      accessList: options.accessList,
      chainId: options.chainId,
      from,
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
          blockHash: ethersReceipt.blockHash as Hash,
          blockNumber: BigInt(ethersReceipt.blockNumber),
          cumulativeGasUsed: ethersReceipt.cumulativeGasUsed.toBigInt(),
          gasUsed: ethersReceipt.gasUsed.toBigInt(),
          effectiveGasPrice: ethersReceipt.effectiveGasPrice.toBigInt(),
          from: ethersReceipt.from as Address,
          logsBloom: ethersReceipt.logsBloom as HexString,
          status: ethersReceipt.status ? "success" : "reverted",
          to: ethersReceipt.to as Address,
          transactionHash: ethersReceipt.transactionHash as Hash,
          transactionIndex: BigInt(ethersReceipt.transactionIndex),
        };
        onMined(receipt);
      });
    }

    return tx.hash as Hash;
  }
}
