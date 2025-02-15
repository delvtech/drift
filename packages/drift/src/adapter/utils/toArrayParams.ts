import type { AbiItemType, AbiParameterKind } from "abitype";
import type {
  Abi,
  AbiArrayType,
  AbiEntryName,
  AbiFriendlyType,
  AbiObjectType,
  AbiParameters,
} from "src/adapter/types/Abi";
import type { WithOptionalFields } from "src/adapter/utils/internal/types";
import type { AnyObject } from "src/utils/types";

/**
 * Converts input or output values into an array, ensuring the correct number
 * and order of values are present.
 *
 * @example
 * ```ts
 * const arrayOutput = toArrayParams({
 *   abi: erc20.abi,
 *   type: "function",
 *   name: "balanceOf",
 *   kind: "outputs",
 *   value: 123n,
 * }); // -> [123n]
 *
 *
 * const arrayOutputFromObject = toArrayParams({
 *   abi: erc20.abi,
 *   type: "function",
 *   name: "balanceOf",
 *   kind: "outputs",
 *   value: { 0: 123n },
 * }); // -> [123n]
 * ```
 *
 * @example
 * ```ts
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
 * const arrayOutput = toArrayParams({
 *   abi,
 *   type: "function",
 *   name: "names",
 *   kind: "outputs",
 *   value: { actorA: "alice", actorB: "bob" },
 * }); // -> ["alice", "bob"]
 * ```
 */
export function toArrayParams<
  TAbi extends Abi,
  TItemType extends AbiItemType,
  TName extends AbiEntryName<TAbi, TItemType>,
  TParameterKind extends AbiParameterKind,
  TValue extends Partial<
    | AbiFriendlyType<TAbi, TItemType, TName, TParameterKind>
    | AbiObjectType<TAbi, TItemType, TName, TParameterKind>
  >,
>({
  abi: _abi,
  type,
  name,
  kind,
  value,
}: {
  abi: TAbi;
  type: TItemType;
  name: TName;
  kind: TParameterKind;
  value?: Abi extends TAbi ? unknown : TValue;
}): AbiArrayType<TAbi, TItemType, TName, TParameterKind> {
  const abi = _abi as unknown as WithOptionalFields<TAbi>;
  // TODO: This should be returned along with the value so it doesn't have to be
  // found again.
  const matches = abi.filter((item) => {
    if (item.type !== type) return false;
    if ((item as any).name !== name) return false;
    if (!(kind in item)) return false;
    return true;
  });

  type _ReturnType = AbiArrayType<TAbi, TItemType, TName, TParameterKind>;

  if (matches.length === 0) {
    return [] as _ReturnType;
  }

  const isObject = isPlainObject(value);

  if (matches.length === 1) {
    const match = matches[0];
    const params = (match![kind] || []) as AbiParameters<
      TAbi,
      TItemType,
      TName,
      TParameterKind
    >;

    if (!params.length) {
      return [] as _ReturnType;
    }

    // Assume a non-object value is the friendly type of a single parameter.
    // e.g., the output of 'balanceOf' is a single uint256 (bigint in JS).
    if (params.length === 1 && !isObject) {
      return [value] as TValue[] as _ReturnType;
    }

    // If there are multiple parameters, the friendly type is an object.
    return params.map(({ name }, i) => value?.[name || i]) as _ReturnType;
  }

  const argsCount = isObject ? Object.keys(value).length : value ? 1 : 0;
  let arrayArgs: any[] = [];
  let keyMatchCount = 0;

  for (const entry of matches) {
    const params = entry[kind]!;

    if (!params.length) {
      if (!argsCount) return [] as _ReturnType;
      continue;
    }

    // Assume a non-object value is the friendly type of a single parameter.
    // e.g., the output of 'balanceOf' is a single uint256 (bigint in JS).
    if (params.length === 1 && value && !isObject) {
      return [value] as TValue[] as _ReturnType;
    }

    const args: AnyObject = isObject ? value : {};
    const potentialArrayArgs: any[] = [];
    let potentialKeyMatchCount = 0;

    for (const [i, input] of params.entries()) {
      const key = input.name || i;
      if (key in args) potentialKeyMatchCount++;
      potentialArrayArgs.push(args[key]);
    }

    if (potentialKeyMatchCount > keyMatchCount) {
      arrayArgs = potentialArrayArgs;
      keyMatchCount = potentialKeyMatchCount;
    }
  }

  return arrayArgs as AbiArrayType<TAbi, TItemType, TName, TParameterKind>;
}

/**
 * Check if a value is an plain object.
 */
function isPlainObject<T>(
  value: T,
): value is T & Record<string | number, unknown> {
  if (!value) return false;
  if (typeof value !== "object") return false;
  if (Object.getPrototypeOf(value) !== Object.prototype) return false;
  return true;
}
