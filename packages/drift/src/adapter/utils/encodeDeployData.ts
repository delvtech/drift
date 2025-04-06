import { AbiConstructor } from "ox";
import type { Abi, Bytes } from "src/adapter/types/Abi";
import type { EncodeDeployDataParams } from "src/adapter/types/Adapter";
import type { ConstructorArgs } from "src/adapter/types/Function";
import { handleError } from "src/adapter/utils/internal/handleError";
import { prepareParams } from "src/adapter/utils/prepareParams";

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
 * Encodes a contract deploy call into {@linkcode Bytes} and its ABI.
 */
export function prepareDeployData<TAbi extends Abi>({
  abi,
  args,
  bytecode,
}: EncodeDeployDataParams<TAbi>) {
  try {
    const { abiEntry, params } = prepareParams({
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
