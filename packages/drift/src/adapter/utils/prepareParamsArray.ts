import type {
  AbiItemType,
  AbiParameter,
  AbiParameterKind,
  AbiStateMutability,
} from "abitype";
import type {
  Abi,
  AbiArrayType,
  AbiEntry,
  AbiEntryName,
  AbiFriendlyType,
  AbiObjectType,
  NamedAbiParameter,
} from "src/adapter/types/Abi";
import { handleError } from "src/adapter/utils/internal/handleError";
import type { AnyObject } from "src/utils/types";

/**
 * Converts input or output values into an array, ensuring the correct number
 * and order of values are present.
 *
 * @example
 * ```ts
 * const outputArray = prepareParamsArray({
 *   abi: erc20.abi,
 *   type: "function",
 *   name: "balanceOf",
 *   kind: "outputs",
 *   value: 123n,
 * }); // -> [123n]
 *
 *
 * const outputArrayFromObject = prepareParamsArray({
 *   abi: erc20.abi,
 *   type: "function",
 *   name: "approve",
 *   kind: "inputs",
 *   value: { amount: 123n, spender: "0x..." },
 * }); // -> ["0x...", 123n]
 * ```
 */
export function prepareParamsArray<
  TAbi extends Abi,
  TItemType extends AbiItemType,
  TName extends AbiEntryName<TAbi, TItemType>,
  TParameterKind extends AbiParameterKind,
  TValue extends Partial<
    | AbiObjectType<TAbi, TItemType, TName, TParameterKind>
    | AbiFriendlyType<TAbi, TItemType, TName, TParameterKind>
  >,
>({
  abi,
  type,
  name,
  kind,
  value,
}: {
  abi: TAbi;
  type: TItemType;
  name: TName;
  kind: TParameterKind;
  value: TValue | undefined;
}): {
  abiEntry: AbiEntry<
    TAbi,
    TItemType,
    TName,
    AbiStateMutability,
    TParameterKind
  >;
  params: AbiArrayType<TAbi, TItemType, TName, TParameterKind>;
} {
  // Type aliases for brevity
  type TAbiEntry = AbiEntry<TAbi, TItemType, TName, any, TParameterKind>;
  type TParams = AbiArrayType<TAbi, TItemType, TName, TParameterKind>;

  const matches = abi.filter((item) => {
    if (item.type !== type) return false;
    if ((item as NamedAbiParameter).name !== name) return false;
    return kind in item;
  }) as TAbiEntry[];

  if (!matches.length) {
    handleError(`No matching ABI entry for ${type} ${name} with ${kind}`);
  }

  // If there's only 1 matching entry, it's the entry we're looking for.
  if (matches.length === 1) {
    const abiEntry = matches[0]!;
    const params = abiEntry[kind];

    if (!params.length) {
      return {
        abiEntry,
        params: [] as TParams,
      };
    }

    if (isUnpacked(value, params)) {
      return {
        abiEntry,
        params: [value] as TValue[] as TParams,
      };
    }

    return {
      abiEntry,
      params: params.map(
        ({ name }, i) => (value as AnyObject)?.[name || i],
      ) as TParams,
    };
  }

  // If there are multiple matching entries, then it must be an overloaded
  // signature. In this case, the parameters of each entry are compared to the
  // given values and the best match is returned.
  const valuesCount =
    value && typeof value === "object" ? Object.keys(value).length : 0;
  let abiEntry = matches[0]!;
  let paramsArray: any[] = [];
  let keyMatchCount = 0;

  for (const match of matches) {
    const params = match[kind];

    if (!params.length) {
      if (!valuesCount) {
        return {
          abiEntry: match,
          params: [] as TParams,
        };
      }
      continue;
    }

    if (isUnpacked(value, params)) {
      return {
        abiEntry: match,
        params: [value] as TValue[] as TParams,
      };
    }

    const args: AnyObject = value || {};
    const potentialParamsArray: any[] = [];
    let potentialKeyMatchCount = 0;

    for (const [i, input] of params.entries()) {
      const key = input.name || i;
      if (key in args) potentialKeyMatchCount++;
      potentialParamsArray.push(args[key]);
    }

    if (potentialKeyMatchCount > keyMatchCount) {
      abiEntry = match;
      keyMatchCount = potentialKeyMatchCount;
      paramsArray = potentialParamsArray;
    }
  }

  return {
    abiEntry,
    params: paramsArray as TValue[] as TParams,
  };
}

/**
 * Checks if the given value is an unpacked value for a single parameter, i.e.,
 * the `AbiFriendlyType` of a single parameter.
 */
function isUnpacked(value: unknown, params: readonly AbiParameter[]) {
  if (params.length !== 1) return false;
  if (!value) return true;

  const { type, name } = params[0]!;
  const arrayBrackets = type.match(/(\[\d*\])+$/)?.[0];

  // If it's not an array param, we can simply check if the value is an object
  if (!arrayBrackets) return typeof value !== "object";
  // Otherwise, if the param is an array, the unpacked value would be an array
  if (!Array.isArray(value)) return false;
  // Values for named array parameters will only be arrays if they're unpacked
  if (name) return true;

  // If the param is an unnamed array, and the value is an array, the depth of
  // the array has to be checked to determine if it's wrapped in an extra array
  // which is interpreted the same as `{ 0: value }`
  let innerValue = value;
  for (const _ of arrayBrackets.match(/\[\d*]/g)!) {
    innerValue = value?.[0];
  }
  return !Array.isArray(innerValue);
}
