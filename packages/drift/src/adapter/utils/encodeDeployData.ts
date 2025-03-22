import { AbiConstructor } from "ox";
import type { Abi, Bytes } from "src/adapter/types/Abi";
import type { EncodeDeployDataParams } from "src/adapter/types/Adapter";
import type { ConstructorArgs } from "src/adapter/types/Function";
import { handleError } from "src/adapter/utils/internal/handleError";
import { prepareParamsArray } from "src/adapter/utils/prepareParamsArray";

/**
 * Encodes a contract deploy call into {@linkcode Bytes}.
 */
export function encodeDeployData<TAbi extends Abi>({
  abi,
  bytecode,
  args,
}: EncodeDeployDataParams<TAbi>): Bytes {
  const { data } = prepareDeployData({
    abi,
    bytecode,
    args: args as ConstructorArgs<TAbi>,
  });
  return data;
}

/**
 * Encodes a contract deploy call into {@linkcode Bytes} and its ABI1.
 */
export function prepareDeployData<TAbi extends Abi>({
  abi,
  args,
  bytecode,
}: { abi: TAbi; args: ConstructorArgs<TAbi>; bytecode: Bytes }) {
  try {
    const { abiEntry, params } = prepareParamsArray({
      abi,
      type: "constructor",
      name: undefined,
      kind: "inputs",
      value: args,
    });
    return {
      abiFn: abiEntry,
      data: AbiConstructor.encode(abiEntry, { args: params as any, bytecode }),
    };
  } catch (e) {
    handleError(e);
  }
}
