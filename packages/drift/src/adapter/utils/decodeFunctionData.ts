import type { Abi } from "abitype";
import { AbiFunction, AbiParameters, Hex } from "ox";
import type { DecodeFunctionDataParams } from "src/adapter/types/Adapter";
import type {
  DecodedFunctionData,
  FunctionName,
} from "src/adapter/types/Function";
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
    const sig = Hex.slice(data, 0, 4);
    const abiFn = AbiFunction.fromAbi(abi, sig);

    return {
      functionName: abiFn.name as TFunctionName,
      args: AbiParameters.decode(abiFn.inputs, Hex.slice(data, 4), {
        as: "Object",
      }),
    } as DecodedFunctionData<TAbi, TFunctionName>;
  } catch (e) {
    handleError(e);
  }
}
