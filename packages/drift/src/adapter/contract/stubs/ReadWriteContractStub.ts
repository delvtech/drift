import type { Abi } from "abitype";
import { type SinonStub, stub } from "sinon";
import { ReadContractStub } from "src/adapter/contract/stubs/ReadContractStub";
import type {
  AdapterReadWriteContract,
  ContractWriteArgs,
  ContractWriteOptions,
} from "src/adapter/contract/types/Contract";
import type {
  FunctionArgs,
  FunctionName,
} from "src/adapter/contract/types/Function";
import { BOB } from "src/utils/testing/accounts";

/**
 * A mock implementation of a writable Ethereum contract designed for unit
 * testing purposes. The `ReadWriteContractStub` extends the functionalities of
 * `ReadContractStub` and provides capabilities to stub out specific
 * contract write behaviors. This makes it a valuable tool when testing
 * scenarios that involve contract writing operations, without actually
 * interacting with a real Ethereum contract.
 *
 * @example
 * const contract = new ReadWriteContractStub(ERC20ABI);
 * contract.stubWrite("addLiquidity", 100n);
 *
 * const result = await contract.write("addLiquidity", []); // 100n
 * @extends {ReadContractStub<TAbi>}
 * @implements {ReadWriteContract<TAbi>}
 */
export class ReadWriteContractStub<TAbi extends Abi = Abi>
  extends ReadContractStub<TAbi>
  implements AdapterReadWriteContract<TAbi>
{
  protected writeStubMap = new Map<
    FunctionName<TAbi, "nonpayable" | "payable">,
    WriteStub<TAbi, FunctionName<TAbi, "nonpayable" | "payable">>
  >();

  getSignerAddress = stub().resolves(BOB);

  /**
   * Simulates a contract write operation for a given function. If the function
   * is not previously stubbed using `stubWrite` from the parent class, an error
   * will be thrown.
   */
  async write<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    ...[functionName, args, options]: ContractWriteArgs<TAbi, TFunctionName>
  ): Promise<`0x${string}`> {
    const stub = this.getWriteStub(functionName);
    if (!stub) {
      throw new Error(
        `Called write for ${functionName} on a stubbed contract without a return value. The function must be stubbed first:\n\tcontract.stubWrite("${functionName}", value)`,
      );
    }
    return stub(args, options);
  }

  /**
   * Stubs the return value for a given function when `simulateWrite` is called
   * with that function name. This method overrides any previously stubbed
   * values for the same function.
   *
   * *Note: The stub doesn't account for dynamic values based on provided
   * arguments/options.*
   */
  stubWrite<TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">>(
    functionName: TFunctionName,
    value: `0x${string}`,
  ): void {
    let writeStub = this.writeStubMap.get(functionName);
    if (!writeStub) {
      writeStub = stub();
      this.writeStubMap.set(functionName, writeStub);
    }
    writeStub.resolves(value);
  }

  /**
   * Retrieves the stub associated with a write function name.
   * Useful for assertions in testing, such as checking call counts.
   */
  getWriteStub<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(functionName: TFunctionName): WriteStub<TAbi, TFunctionName> | undefined {
    return this.writeStubMap.get(functionName) as WriteStub<
      TAbi,
      TFunctionName
    >;
  }
}

/**
 * Type representing a stub for the "write" and "simulateWrite" functions of a
 * contract.
 */
type WriteStub<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
> = SinonStub<
  [args?: FunctionArgs<TAbi, TFunctionName>, options?: ContractWriteOptions],
  `0x${string}`
>;
