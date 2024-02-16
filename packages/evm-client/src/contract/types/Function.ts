import { Abi, AbiStateMutability } from 'abitype';
import { AbiFriendlyType, AbiObjectType } from 'src/contract/types/AbiEntry';

/**
 * Get a union of function names from an abi
 */
export type FunctionName<
  TAbi extends Abi,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = Extract<
  TAbi[number],
  { type: 'function'; stateMutability: TAbiStateMutability }
>['name'];

/**
 * Get an object type for an abi function's arguments.
 */
export type FunctionArgs<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = AbiObjectType<TAbi, 'function', TFunctionName, 'inputs'>;

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
