import type { Abi } from "abitype";
import type { Bytes } from "src/adapter/types/Abi";
import type {
  EncodeFunctionDataParams
} from "src/adapter/types/Adapter";
import type {
  FunctionArgs,
  FunctionName
} from "src/adapter/types/Function";
import { handleError } from "src/adapter/utils/internal/handleError";
import { prepareFunctionData } from "src/adapter/utils/internal/prepareFunctionData";

export function encodeFunctionData<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
>({ abi, fn, args }: EncodeFunctionDataParams<TAbi, TFunctionName>): Bytes {
  try {
    const { data } = prepareFunctionData({
      abi,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
    });
    return data;
  } catch (e) {
    handleError(e);
  }
}
