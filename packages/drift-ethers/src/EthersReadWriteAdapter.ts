import {
  type AdapterWriteParams,
  type FunctionName,
  type HexString,
  type ReadWriteAdapter,
  objectToArray,
} from "@delvtech/drift";
import type { Abi } from "abitype";
import type { Signer } from "ethers";
import { Contract } from "ethers";
import type { InterfaceAbi } from "ethers";
import {
  EthersReadAdapter,
  type EthersReadAdapterParams,
} from "src/EthersReadAdapter";

export interface EthersReadWriteAdapterParams extends EthersReadAdapterParams {
  signer: Signer;
}

export class EthersReadWriteAdapter
  extends EthersReadAdapter
  implements ReadWriteAdapter
{
  signer: Signer;

  constructor({ provider, signer }: EthersReadWriteAdapterParams) {
    super({ provider });
    this.signer = signer;
  }

  getSignerAddress() {
    return this.signer.getAddress() as Promise<HexString>;
  }

  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: AdapterWriteParams<TAbi, TFunctionName>) {
    return super.simulateWrite({
      ...params,
      from: params.from ?? (await this.signer.getAddress()),
    } as AdapterWriteParams<TAbi, TFunctionName>);
  }

  async write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: AdapterWriteParams<TAbi, TFunctionName>) {
    const { abi, address, args, fn, onMined, ...options } = params;
    const contract = new Contract(address, abi as InterfaceAbi, this.signer);

    const arrayArgs = objectToArray({
      abi: abi as Abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });

    const writePromise = contract.getFunction(fn)(...arrayArgs, {
      accessList: options.accessList,
      chainId: options.chainId,
      from: options.from,
      gasLimit: options.gas,
      gasPrice: options.gasPrice,
      maxFeePerGas: options.maxFeePerGas,
      maxPriorityFeePerGas: options.maxPriorityFeePerGas,
      nonce: options.nonce ? Number(options.nonce) : undefined,
      type: options.type ? Number(options.type) : undefined,
      value: options.value,
    });

    if (params.onMined) {
      writePromise.then((hash) => {
        this.waitForTransaction({ hash }).then(params.onMined);
        return hash;
      });
    }

    return writePromise;
  }
}
