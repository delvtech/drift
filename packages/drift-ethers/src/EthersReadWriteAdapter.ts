import {
  type Abi,
  type FunctionName,
  type HexString,
  type ReadWriteAdapter,
  type WriteParams,
  objectToArray,
} from "@delvtech/drift";
import type { Provider, Signer } from "ethers";
import { Contract } from "ethers";
import type { InterfaceAbi } from "ethers";
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
      from,
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
