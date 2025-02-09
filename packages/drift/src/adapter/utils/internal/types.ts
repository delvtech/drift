import type { AbiParameter } from "abitype";
import type { Abi } from "src/adapter/types/Abi";

/** @internal */
export type WithOptionalFields<T extends Abi> = (T[number] & {
  name?: string;
  inputs?: AbiParameter[];
  outputs?: AbiParameter[];
})[];
