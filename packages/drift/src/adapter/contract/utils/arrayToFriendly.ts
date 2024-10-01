import type { Abi, AbiItemType, AbiParameter, AbiParameterKind } from "abitype";
import type {
  AbiArrayType,
  AbiEntryName,
  AbiFriendlyType,
} from "src/adapter/contract/types/AbiEntry";
import { getAbiEntry } from "src/adapter/contract/utils/getAbiEntry";

/**
 * Converts an array of input or output values into an
 * {@linkcode AbiFriendlyType}, ensuring the values are properly identified
 * based on their index.
 *
 * @example
 * const abi = [
 *   {
 *     type: "function",
 *     name: "transfer",
 *     inputs: [
 *       { name: "to", type: "address" },
 *       { name: "value", type: "uint256" },
 *     ],
 *     outputs: [{ name: "", type: "bool" }],
 *     stateMutability: "nonpayable",
 *   },
 *   {
 *     type: "event",
 *     name: "Approval",
 *     inputs: [
 *       { indexed: true, name: "owner", type: "address" },
 *       { indexed: true, name: "spender", type: "address" },
 *       { indexed: false, name: "value", type: "uint256" },
 *     ],
 *   },
 * ] as const;
 *
 * const parsedArgs = arrayToFriendly({
 *   abi,
 *   type: "function",
 *   name: "transfer",
 *   kind: "inputs",
 *   values: ["0x123", 123n],
 * }); // -> { to: "0x123", value: 123n }
 *
 * const parsedReturn = arrayToFriendly({
 *   abi,
 *   type: "function",
 *   name: "transfer",
 *   kind: "outputs",
 *   values: [true],
 * }); // -> true
 *
 * const parsedFilter = arrayToFriendly({
 *   abi,
 *   type: "event",
 *   name: "Approval",
 *   kind: "inputs",
 *   values: [undefined, "0x123", undefined],
 * }); // -> { owner: undefined, spender: "0x123", value: undefined }
 */
export function arrayToFriendly<
  TAbi extends Abi,
  TItemType extends AbiItemType,
  TName extends AbiEntryName<TAbi, TItemType>,
  TParameterKind extends AbiParameterKind,
>({
  abi,
  type,
  name,
  kind,
  values,
}: {
  abi: TAbi;
  name: TName;
  values?: Abi extends TAbi
    ? readonly unknown[] // <- fallback for unknown ABI type
    : Partial<AbiArrayType<TAbi, TItemType, TName, TParameterKind>>;
  kind: TParameterKind;
  type: TItemType;
}): AbiFriendlyType<TAbi, TItemType, TName, TParameterKind> {
  const abiEntry = getAbiEntry({ abi, type, name });

  let parameters: AbiParameter[] = [];
  if (kind in abiEntry) {
    parameters = (abiEntry as any)[kind];
  }

  // Single or no parameters
  if (parameters.length <= 1) {
    return (values as any[])[0];
  }

  const valuesArray = values || [];

  const friendlyValue: Record<string, any> = {};
  parameters.forEach(({ name }, i) => {
    if (name) {
      friendlyValue[name] = valuesArray[i];
    } else {
      friendlyValue[i] = valuesArray[i];
    }
  });

  return friendlyValue as any;
}
