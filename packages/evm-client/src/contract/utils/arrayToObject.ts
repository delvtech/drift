import { Abi, AbiItemType, AbiParameter, AbiParameterKind } from 'abitype';
import {
  AbiArrayType,
  AbiEntryName,
  AbiObjectType,
} from 'src/contract/types/AbiEntry';
import { getAbiEntry } from 'src/contract/utils/getAbiEntry';

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
}): AbiObjectType<TAbi, TItemType, TName, TParameterKind> {
  const abiEntry = getAbiEntry({ abi, type, name });

  let parameters: AbiParameter[] = [];
  if (kind in abiEntry) {
    parameters = (abiEntry as any)[kind];
  }

  const valuesArray = values || [];

  const valuesObject: Record<string, any> = {};
  parameters.forEach(({ name }, i) => {
    if (name) {
      valuesObject[name] = valuesArray[i];
    } else {
      valuesObject[i] = valuesArray[i];
    }
  });

  return valuesObject as any;
}
