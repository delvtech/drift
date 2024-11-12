import {
  type FunctionName,
  type FunctionReturn,
  arrayToObject,
} from "@delvtech/drift";
import type { Abi } from "viem";

export function outputToFriendly<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> & {} = FunctionName<TAbi> & {},
>({
  abi,
  functionName,
  output,
}: {
  abi: TAbi;
  functionName: TFunctionName;
  output: unknown;
}) {
  // Viem automatically returns a single value if the function has only one
  // output parameter so we don't need to convert it. It's important to
  // check the ABI to determine the number of output parameters vs. checking
  // if the output is an array because the outputs could be a single array
  // (tuple) parameter.
  const objectArgs = arrayToObject({
    abi: abi as Abi,
    name: functionName,
    kind: "outputs",
    values: Array.isArray(output) ? output : [output],
  });

  if (Object.keys(objectArgs).length === 1) {
    return output as FunctionReturn<TAbi, TFunctionName>;
  }

  return objectArgs as unknown as FunctionReturn<TAbi, TFunctionName>;
}
