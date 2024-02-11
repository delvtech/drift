import { Abi, AbiStateMutability } from 'abitype';
import { AbiEntry, AbiFriendlyType } from 'src/contract/types/AbiEntry';

/**
 * Get a union of function names from an abi
 */
export type FunctionName<
  TAbi extends Abi,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = Extract<
  AbiEntry<TAbi, 'function'>,
  { stateMutability: TAbiStateMutability }
>['name'];

/**
 * Get a user-friendly argument type for an abi function, which is determined by
 * it's inputs:
 * - __Single input:__ the type of the single input.
 * - __Multiple inputs:__ an object with the input names as keys and the input
 *   types as values.
 * - __No inputs:__ `undefined` or an empty object.
 */
export type FunctionArgs<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = AbiFriendlyType<TAbi, 'function', TFunctionName, 'inputs'>;

/**
 * Get a user-friendly return type for an abi function, which is determined by
 * it's outputs:
 * - __Single output:__ the type of the single output.
 * - __Multiple outputs:__ an object with the output names as keys and the
 *   output types as values.
 * - __No outputs:__ `undefined`.
 */
export type FunctionReturn<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> = AbiFriendlyType<TAbi, 'function', TFunctionName, 'outputs'>;

/**
 * Get an object representing decoded function or constructor data from an ABI.
 */
export type DecodedFunctionData<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> = {
  [K in TFunctionName]: {
    args: FunctionArgs<TAbi, K>;
    functionName: K;
  };
}[TFunctionName];
