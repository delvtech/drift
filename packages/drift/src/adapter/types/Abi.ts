import type {
  Abi,
  AbiItemType,
  AbiParameter,
  AbiParameterKind,
  AbiParameterToPrimitiveType,
  AbiParametersToPrimitiveTypes,
  AbiStateMutability,
} from "abitype";
import type {
  EmptyObject,
  MergeKeys,
  Pretty,
  ReplaceProps,
} from "src/utils/types";

// https://docs.soliditylang.org/en/latest/abi-spec.html#json
// https://github.com/ethereum/execution-apis/blob/f9cdb15b23c60342dd6f97731382358d817287e3/src/schemas/base-types.yaml

/**
 * An interface of common types that might be typed differently in different
 * implementations. Defining these types in an interface makes it possible to
 * override them via [`declaration
 * merging`](https://www.typescriptlang.org/docs/handbook/declaration-merging.html).
 *
 * @example
 * ```ts
 * declare module "@delvtech/drift" {
 *   export interface BaseTypes {
 *     addressType: string;
 *     bytesType: string;
 *     hashType: string;
 *     hexStringType: string;
 *   }
 * }
 * ```
 *
 * @see https://abitype.dev/config#overview
 */
export interface BaseTypes extends _BaseTypes {}
interface _BaseTypes {
  addressType: `0x${string}`;
  bytesType: `0x${string}`;
  hashType: `0x${string}`;
  hexStringType: `0x${string}`;
}

export type HexString = BaseTypes["hexStringType"];
export type Address = BaseTypes["addressType"];
export type Bytes = BaseTypes["bytesType"];
export type Hash = BaseTypes["hashType"];

// Override the types in `abitype`.
declare module "abitype" {
  export interface Register {
    addressType: Address;
    bytesType: {
      inputs: Bytes;
      outputs: Bytes;
    };
  }
}

export type NamedAbiParameter = AbiParameter extends infer TAbiParameter
  ? TAbiParameter extends { name: string }
    ? TAbiParameter
    : ReplaceProps<TAbiParameter, { name: string }>
  : never;

/**
 * Get a union of possible names for an abi item type.
 *
 * @example
 * ```ts
 * type Erc20EventNames = AbiEntryName<Erc20Abi, "event">;
 * // -> "Approval" | "Transfer"
 * ```
 */
export type AbiEntryName<
  TAbi extends Abi,
  TItemType extends AbiItemType = AbiItemType,
> = Extract<TAbi[number], { type: TItemType; name?: string }>["name"];

/**
 * Get the ABI entry for a specific type, name, and state mutability.
 *
 * @example
 * ```ts
 * type ApproveEntry = AbiEntry<Erc20Abi, "function", "approve">;
 * // ->
 * // {
 * //   type: "function";
 * //   name: "approve";
 * //   inputs: [{ name: "spender", type: "address" }, { name: "value", type: "uint256" }];
 * //   outputs: [{ name: "", type: "bool" }];
 * //   stateMutability: "nonpayable";
 * // }
 * ```
 */
export type AbiEntry<
  TAbi extends Abi = Abi,
  TItemType extends AbiItemType = AbiItemType,
  TName extends AbiEntryName<TAbi, TItemType> = AbiEntryName<TAbi, TItemType>,
  TStateMutability extends AbiStateMutability = AbiStateMutability,
> = Extract<
  TAbi[number],
  { type: TItemType; name?: TName; stateMutability?: TStateMutability }
>;

/**
 * Get the parameters for a specific ABI entry.
 *
 * @example
 * ```ts
 * type ApproveParameters = AbiParameters<Erc20Abi, "function", "approve", "inputs">;
 * // -> [{ name: "spender", type: "address" }, { name: "value", type: "uint256" }]
 * ```
 */
export type AbiParameters<
  TAbi extends Abi = Abi,
  TItemType extends AbiItemType = AbiItemType,
  TName extends AbiEntryName<TAbi, TItemType> = AbiEntryName<TAbi, TItemType>,
  TParameterKind extends AbiParameterKind = AbiParameterKind,
> = AbiEntry<TAbi, TItemType, TName> extends infer TAbiEntry
  ? TParameterKind extends keyof TAbiEntry
    ? TAbiEntry[TParameterKind]
    : []
  : [];

/**
 * Add default names to any ABI parameters that are missing a name. The default
 * name is the index of the parameter.
 *
 * @example
 * ```ts
 * type Parameters = WithDefaultNames<[{ name: "spender", type: "address" }, { type: "uint256" }]>;
 * // -> [{ name: "spender", type: "address" }, { name: "1", type: "uint256" }]
 * ```
 */
type WithDefaultNames<TParameters extends readonly AbiParameter[]> = {
  [K in keyof TParameters]: TParameters[K] extends infer TParameter extends
    AbiParameter
    ? TParameter extends NamedAbiParameter
      ? TParameter
      : ReplaceProps<MergeKeys<TParameter>, { name: `${K}` | string }>
    : never;
};

/**
 * Convert an array or tuple of named abi parameters to an object type with the
 * parameter names as keys and their primitive types as values. If a parameter
 * has an empty name, it's index is used as the key.
 *
 * @example
 * ```ts
 * type Parameters = NamedParametersToObject<[{ name: "spender", type: "address" }, { name: "", type: "uint256" }]>;
 * // -> { spender: `${string}`, "1": bigint }
 * ```
 */
type NamedParametersToObject<
  TParameters extends readonly NamedAbiParameter[],
  TParameterKind extends AbiParameterKind = AbiParameterKind,
> = NamedAbiParameter[] extends TParameters
  ? Record<number | string, any>
  : Pretty<
      {
        // For every parameter name, excluding empty names, add a key to the
        // object for the parameter name
        [TName in Exclude<
          TParameters[number]["name"],
          ""
        >]: AbiParameterToPrimitiveType<
          Extract<TParameters[number], { name: TName }>,
          TParameterKind
        > extends infer TPrimitive
          ? unknown extends TPrimitive
            ? any
            : TPrimitive
          : never;
        // Check if the parameters are in a Tuple. Tuples have known indexes, so
        // we can use the index as the key for the nameless parameters
      } & (TParameters extends readonly [
        NamedAbiParameter,
        ...NamedAbiParameter[],
      ]
        ? {
            // For every key on the parameters type, if it's value is a
            // parameter and the parameter's name is empty (""), then add a key
            // for the index
            [K in keyof TParameters as TParameters[K] extends NamedAbiParameter
              ? TParameters[K]["name"] extends ""
                ? // Exclude `number` to ensure only the specific index keys are
                  // included and not `number` itself. TODO: Test that this is
                  // actually doing what's described.
                  Exclude<K, number>
                : never // <- Key for named parameters (already handled above)
              : never /* <- Prototype key (e.g., `length`, `toString`) */]: TParameters[K] extends NamedAbiParameter
              ? AbiParameterToPrimitiveType<TParameters[K], TParameterKind>
              : never; // <- Prototype value
          }
        : // If the parameters are not in a Tuple, then we can't use the index
          // as a key, so we have to use `number` as the key for any parameters
          // that have empty names ("") in arrays
          Extract<TParameters[number], { name: "" }> extends never
          ? {} // <- No parameters with empty names
          : {
              [index: number]: AbiParameterToPrimitiveType<
                Extract<TParameters[number], { name: "" }>,
                TParameterKind
              >;
            })
    >;

/**
 * Convert an array or tuple of abi parameters to an object type.
 *
 * @example
 * ```ts
 * type ApproveArgs = AbiParametersToObject<[
 *   { name: "spender", type: "address" },
 *   { name: "value", type: "uint256" }
 * ]>;
 * // -> { spender: string, value: bigint }
 * ```
 */
export type AbiParametersToObject<
  TParameters extends readonly AbiParameter[],
  TParameterKind extends AbiParameterKind = AbiParameterKind,
> = TParameters extends readonly []
  ? EmptyObject
  : TParameters extends NamedAbiParameter[]
    ? NamedParametersToObject<TParameters, TParameterKind>
    : NamedParametersToObject<WithDefaultNames<TParameters>, TParameterKind>;

/**
 * Get an array of primitive types for any ABI parameters.
 *
 * @example
 * ```ts
 * type ApproveInput = AbiArrayType<Erc20Abi, "function", "approve", "inputs">;
 * // -> [string, bigint]
 *
 * type BalanceOutput = AbiArrayType<Erc20Abi, "function", "balanceOf", "outputs">;
 * // -> [bigint]
 * ```
 */
export type AbiArrayType<
  TAbi extends Abi,
  TItemType extends AbiItemType = AbiItemType,
  TName extends AbiEntryName<TAbi, TItemType> = AbiEntryName<TAbi, TItemType>,
  TParameterKind extends AbiParameterKind = AbiParameterKind,
> = AbiParameters<
  TAbi,
  TItemType,
  TName,
  TParameterKind
> extends infer TParameters
  ? TParameters extends readonly AbiParameter[]
    ? AbiParametersToPrimitiveTypes<TParameters>
    : []
  : [];

/**
 * Get an object of primitive types for any ABI parameters.
 *
 * @example
 * ```ts
 * type ApproveArgs = AbiObjectType<Erc20Abi, "function", "approve", "inputs">;
 * // -> { spender: string, value: bigint }
 *
 * type Balance = AbiObjectType<Erc20Abi, "function", "balanceOf", "outputs">;
 * // -> { balance: bigint }
 * ```
 */
export type AbiObjectType<
  TAbi extends Abi,
  TItemType extends AbiItemType = AbiItemType,
  TName extends AbiEntryName<TAbi, TItemType> = AbiEntryName<TAbi, TItemType>,
  TParameterKind extends AbiParameterKind = AbiParameterKind,
> = AbiParametersToObject<
  AbiParameters<TAbi, TItemType, TName, TParameterKind>
>;

/**
 * Get a user-friendly primitive type for any ABI parameters, which is
 * determined by the number of parameters:
 * - __Single parameter:__ the primitive type of the parameter.
 * - __Multiple parameters:__ an object with the parameter names as keys and the
 *   their primitive types as values. If a parameter has no name, it's index is
 *   used as the key.
 * - __No parameters:__ `undefined`.
 *
 * @example
 * ```ts
 * type ApproveArgs = AbiFriendlyType<Erc20Abi, "function", "approve", "inputs">;
 * // -> { spender: `${string}`, value: bigint }
 *
 * type Balance = AbiFriendlyType<Erc20Abi, "function", "balanceOf", "outputs">;
 * // -> bigint
 *
 * type DecimalArgs = AbiFriendlyType<Erc20Abi, "function", "decimals", "inputs">;
 * // -> undefined
 * ```
 */
export type AbiFriendlyType<
  TAbi extends Abi,
  TItemType extends AbiItemType = AbiItemType,
  TName extends AbiEntryName<TAbi, TItemType> = AbiEntryName<TAbi, TItemType>,
  TParameterKind extends AbiParameterKind = AbiParameterKind,
  TStateMutability extends AbiStateMutability = AbiStateMutability,
> = Abi extends TAbi
  ? unknown
  : AbiEntry<TAbi, TItemType, TName, TStateMutability> extends infer TAbiEntry
    ? TParameterKind extends keyof TAbiEntry & AbiParameterKind // Check if the ABI entry includes the parameter kind (inputs/outputs)
      ? TAbiEntry[TParameterKind] extends readonly [AbiParameter] // Check if it's a single parameter
        ? AbiParameterToPrimitiveType<
            TAbiEntry[TParameterKind][0],
            TParameterKind
          > // Single parameter type
        : TAbiEntry[TParameterKind] extends readonly [
              AbiParameter,
              ...AbiParameter[],
            ] // Check if it's multiple parameters
          ? AbiParametersToObject<TAbiEntry[TParameterKind], TParameterKind> // Multiple parameters type
          : undefined // Empty parameters
      : undefined // ABI entry doesn't include the parameter kind (inputs/outputs)
    : undefined; // ABI entry not found
