import type {
  Abi,
  AbiFunction,
  AbiItemType, AbiParameterKind
} from "abitype";
import { AbiItem } from "ox";
import type {
  AbiArrayType,
  AbiEntryName,
  AbiObjectType,
} from "src/adapter/types/Abi";

/**
 * Converts an array of input or output values into an object typ, ensuring the
 * values are properly identified based on their index.
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
 * const parsedArgs = arrayToObject({
 *   abi,
 *   type: "function",
 *   name: "transfer",
 *   kind: "inputs",
 *   values: ["0x123", 123n],
 * }); // -> { to: "0x123", value: 123n }
 *
 * const parsedFilter = arrayToObject({
 *   abi,
 *   type: "event",
 *   name: "Approval",
 *   kind: "inputs",
 *   values: [undefined, "0x123", undefined],
 * }); // -> { owner: undefined, spender: "0x123", value: undefined }
 */
export function arrayToObject<
  TAbi extends Abi,
  TItemType extends AbiItemType,
  TName extends AbiEntryName<TAbi, TItemType>,
  TParameterKind extends AbiParameterKind,
>({
  abi,
  name,
  kind,
  values,
}: {
  abi: TAbi;
  name: TName;
  kind: TParameterKind;
  values?: Abi extends TAbi
    ? readonly unknown[] // <- fallback for unknown ABI type
    : Partial<AbiArrayType<TAbi, TItemType, TName, TParameterKind>>;
}): AbiObjectType<TAbi, TItemType, TName, TParameterKind> {
  const item = AbiItem.fromAbi(abi, name as any, {
    args: values,
  });

  if (!item || !(kind in item)) {
    return {} as AbiObjectType<TAbi, TItemType, TName, TParameterKind>;
  }

  return Object.fromEntries(
    (item as AbiFunction)[kind].map(({ name }, i) => [name || i, values?.[i]]),
  ) as AbiObjectType<TAbi, TItemType, TName, TParameterKind>;
}
