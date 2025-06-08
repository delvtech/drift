import type {
  AbiConstructor,
  AbiItemType,
  AbiParameter,
  AbiParameterKind,
} from "abitype";
import type {
  Abi,
  AbiArrayType,
  AbiEntry,
  AbiEntryName,
  AbiFilter,
  AbiObjectType,
  AbiSimplifiedType,
} from "src/adapter/types/Abi";
import { DriftError } from "src/error/DriftError";
import type { AnyObject } from "src/utils/types";

const DEFAULT_CONSTRUCTOR: AbiConstructor = {
  type: "constructor",
  inputs: [],
  stateMutability: "nonpayable",
};

/**
 * Converts input or output values into an array, ensuring the correct number
 * and order of values are present.
 *
 * @example
 * ```ts
 * const approveCall = prepareParams({
 *   abi: erc20.abi,
 *   type: "function",
 *   name: "approve",
 *   kind: "inputs",
 *   value: { amount: 123n, spender: "0x..." },
 * });
 * // -> {
 * //   abiEntry: { type: "function", name: "approve", ... },
 * //   params: ["0x...", 123n],
 * // }
 *
 * const balanceOfReturn = prepareParams({
 *   abi: erc20.abi,
 *   type: "function",
 *   name: "balanceOf",
 *   kind: "outputs",
 *   value: 123n,
 * });
 * // -> {
 * //   abiEntry: { type: "function", name: "balanceOf", ... },
 * //   params: [123n],
 * // }
 * ```
 */
export function prepareParams<
  TAbi extends Abi,
  TItemType extends AbiItemType,
  TName extends AbiEntryName<TAbi, TItemType>,
  TParameterKind extends AbiParameterKind,
  TValue extends Partial<
    | AbiObjectType<TAbi, TItemType, TName, TParameterKind>
    | AbiSimplifiedType<TAbi, TItemType, TName, TParameterKind>
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
  abiEntry: AbiEntry<TAbi, TItemType, TName, any, TParameterKind>;
  params: AbiArrayType<TAbi, TItemType, TName, TParameterKind>;
} {
  type TArray = AbiArrayType<TAbi, TItemType, TName, TParameterKind>;

  const matches = abi.filter((item) => {
    if (item.type !== type) return false;
    if ((item as AnyObject).name !== name) return false;
    return kind in item;
  }) as (AbiEntry<TAbi, TItemType, TName, any, TParameterKind> &
    AbiFilter<TItemType, TName, any, TParameterKind>)[];

  if (!matches.length) {
    if (type === "constructor") {
      return {
        abiEntry: DEFAULT_CONSTRUCTOR as any,
        params: [] as TArray,
      };
    }
    throw new DriftError(
      `No matching ABI entry for ${type} ${name} with ${kind}`,
    );
  }

  // If there's only 1 matching entry, it's the entry we're looking for.
  if (matches.length === 1) {
    const abiEntry = matches[0]!;
    const params = abiEntry[kind];

    if (!params.length) {
      return {
        abiEntry,
        params: [] as TArray,
      };
    }

    if (isUnpacked(value, params)) {
      return {
        abiEntry,
        params: [value] as TValue[] as TArray,
      };
    }

    return {
      abiEntry,
      params: params.map(
        ({ name }, i) => (value as AnyObject)?.[name || i],
      ) as TArray,
    };
  }

  // If there are multiple matching entries, then it must be an overloaded
  // signature. In this case, the parameters of each entry are compared to the
  // given values and the best match is returned.
  const valuesCount =
    value && typeof value === "object" ? Object.keys(value).length : 0;
  let bestMatch = matches[0]!;
  let bestMatchParamsArray: any[] = [];
  let bestKeyMatchCount = 0;

  for (const match of matches) {
    const params = match[kind];

    if (!params.length) {
      if (!valuesCount) {
        return {
          abiEntry: match,
          params: [] as TArray,
        };
      }
      continue;
    }

    if (isUnpacked(value, params)) {
      return {
        abiEntry: match,
        params: [value] as TValue[] as TArray,
      };
    }

    const args: AnyObject = value || {};
    const candidateParamsArray: any[] = [];
    let candidateKeyMatchCount = 0;

    for (const [i, { name }] of params.entries()) {
      const key = name || i;
      candidateParamsArray.push(args[key]);
      if (key in args) candidateKeyMatchCount++;
    }

    if (candidateKeyMatchCount > bestKeyMatchCount) {
      bestMatch = match;
      bestMatchParamsArray = candidateParamsArray;
      bestKeyMatchCount = candidateKeyMatchCount;
    }
  }

  return {
    abiEntry: bestMatch,
    params: bestMatchParamsArray as TValue[] as TArray,
  };
}

/**
 * Checks if the given value is an unpacked value for a single parameter, i.e.,
 * the `AbiSimplifiedType` of a single parameter.
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
  for (const _ of arrayBrackets.match(/\[\d*]/g)!) innerValue = value?.[0];
  return !Array.isArray(innerValue);
}
