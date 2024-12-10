import { AbiConstructor } from "ox";
import type { Bytes, HexString } from "src/adapter/types/Abi";
import { CodeCaller } from "src/artifacts/CodeCaller";

/**
 * Prepares call data for a bytecode (deployless) call
 * @param bytecode
 * @param data
 * @returns
 */
export function prepareBytecodeCallData(
  bytecode: HexString,
  data: Bytes,
): Bytes {
  const CodeCallerConstructor = AbiConstructor.fromAbi(CodeCaller.abi);
  return AbiConstructor.encode(CodeCallerConstructor, {
    bytecode: CodeCaller.bytecode,
    args: [bytecode, data],
  });
}
