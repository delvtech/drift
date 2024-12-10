import type { Abi, AbiItemType, AbiParameterKind } from "abitype";
import type {
  AbiArrayType,
  AbiEntryName,
  AbiFriendlyType,
} from "src/adapter/types/Abi";
import { arrayToObject } from "src/adapter/utils/arrayToObject";

/**
 * Converts an array of input or output values into a user-friendly type, ensuring the
 * values are properly identified based on their index.
 *
 * @example
 * const abi = [
 *   {
 *     name: "names",
 *     type: "function",
 *     inputs: [],
 *     outputs: [
 *       { name: "actorA", type: "string" },
 *       { name: "actorB", type: "string" },
 *     ],
 *     stateMutability: "view",
 *   },
 * ]] as const;
 *
 * const output1 = arrayToFriendly({
 *   abi,
 *   type: "function",
 *   name: "names",
 *   kind: "outputs",
 *   values: ["alice", "bob"],
 * }); // -> { actorA: "alice", actorB: "bob" }
 *
 * const output2 = arrayToFriendly({
 *   abi: erc20.abi,
 *   type: "function",
 *   name: "balanceOf",
 *   kind: "outputs",
 *   values: [123n],
 * }); // -> 123n
 */
export function arrayToFriendly<
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
}): AbiFriendlyType<TAbi, TItemType, TName, TParameterKind> {
  const obj = arrayToObject({
    abi,
    name,
    kind,
    values,
  });

  const _values = Object.values(obj);
  if (_values.length === 1) {
    return _values[0] as AbiFriendlyType<
      TAbi,
      TItemType,
      TName,
      TParameterKind
    >;
  }

  return obj as unknown as AbiFriendlyType<
    TAbi,
    TItemType,
    TName,
    TParameterKind
  >;
}
