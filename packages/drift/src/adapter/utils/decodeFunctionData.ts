import { AbiFunction, AbiParameters } from "ox";
import type { Abi, HexString } from "src/adapter/types/Abi";
import type { DecodeFunctionDataParams } from "src/adapter/types/Adapter";
import type {
  DecodedFunctionData,
  FunctionArgs,
  FunctionName,
} from "src/adapter/types/Function";
import { arrayToObject } from "src/adapter/utils/arrayToObject";
import { handleError } from "src/adapter/utils/internal/handleError";

export function decodeFunctionData<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
>({
  abi,
  data,
}: DecodeFunctionDataParams<TAbi, TFunctionName>): DecodedFunctionData<
  TAbi,
  TFunctionName
> {
  try {
    const sig = data.slice(0, 10) as HexString;
    const argsData = `0x${data.slice(10)}` as HexString;
    const abiFn = AbiFunction.fromAbi(abi, sig);
    const arrayArgs = AbiParameters.decode(abiFn.inputs, argsData, {
      // Ox can also decode as "Object", but will key unnamed params as `''`, so
      // we decode as "Array" and run through arrayToObject to ensure consistent
      // output.
      as: "Array",
      checksumAddress: true,
    }) as any;
    const functionName = abiFn.name as TFunctionName;
    const args: FunctionArgs<TAbi, TFunctionName> = arrayToObject({
      abi,
      name: functionName,
      kind: "inputs",
      values: arrayArgs,
    });
    return { functionName, args };
  } catch (e) {
    handleError(e);
  }
}
