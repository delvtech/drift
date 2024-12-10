import type { Abi, AbiParameter } from "abitype";

/** @internal */
export type WithOptionalFields<T extends Abi> = (T[number] & {
  name?: string;
  inputs?: AbiParameter[];
  outputs?: AbiParameter[];
})[];
