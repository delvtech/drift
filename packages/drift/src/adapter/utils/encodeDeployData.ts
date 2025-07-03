import { AbiConstructor } from "ox";
import type { Abi, Bytes } from "src/adapter/types/Abi";
import type { EncodeDeployDataParams } from "src/adapter/types/Adapter";
import { handleError } from "src/adapter/utils/internal/handleError";
import { prepareParams } from "src/adapter/utils/prepareParams";

/**
 * Encodes a contract deploy call into {@linkcode Bytes}.
 */
export function encodeDeployData<TAbi extends Abi>(
  params: EncodeDeployDataParams<TAbi>,
): Bytes {
  return prepareDeployData(params).data;
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
      abiEntry,
      data: AbiConstructor.encode(abiEntry, { args: params as any, bytecode }),
    };
  } catch (e) {
    handleError(e);
  }
}
