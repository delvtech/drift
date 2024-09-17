import {
  FunctionReturn,
  arrayToFriendly,
  getAbiEntry,
} from "@delvtech/evm-client";
import { Abi } from "viem";

export function outputToFriendly<TAbi extends Abi>({
  abi,
  functionName,
  output,
}: {
  abi: TAbi;
  functionName: string;
  output: unknown;
}) {
  // Viem automatically returns a single value if the function has only one
  // output parameter so we don't need to convert it. It's important to
  // check the ABI to determine the number of output parameters vs. checking
  // if the output is an array because the outputs could be a single array
  // (tuple) parameter.
  const abiEntry = getAbiEntry({
    abi,
    type: "function",
    name: functionName,
  });
  if (abiEntry.outputs.length === 1) {
    return output as FunctionReturn<TAbi, typeof functionName>;
  }

  return arrayToFriendly({
    abi: abi as Abi,
    type: "function",
    name: functionName,
    kind: "outputs",
    values: output as unknown[],
  }) as FunctionReturn<TAbi, typeof functionName>;
}
