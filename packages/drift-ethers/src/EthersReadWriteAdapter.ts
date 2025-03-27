import {
  type Abi,
  type DeployParams,
  DriftError,
  type FunctionName,
  type ReadWriteAdapter,
  type SimulateWriteParams,
  type WriteParams,
  prepareParamsArray,
} from "@delvtech/drift";
import type { Provider, Signer } from "ethers";
import { ContractFactory } from "ethers";
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
    const contract = new Contract(address, abi as InterfaceAbi, this.signer);

    const { params } = prepareParamsArray({
      abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });

    const writePromise = contract.getFunction(fn)(...params, {
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
      writePromise.then((hash) => {
        this.waitForTransaction({ hash }).then(onMined);
        return hash;
      });
    }

    return writePromise;
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
}
