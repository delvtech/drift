import type { Abi, Bytes } from "src/adapter/types/Abi";
import type {
  Adapter,
  DecodeFunctionDataParams,
  DecodeFunctionReturnParams,
  EncodeDeployDataParams,
  EncodeFunctionDataParams,
  EncodeFunctionReturnParams,
} from "src/adapter/types/Adapter";
import type { FunctionName, FunctionReturn } from "src/adapter/types/Function";
import { decodeFunctionData } from "src/adapter/utils/decodeFunctionData";
import { decodeFunctionReturn } from "src/adapter/utils/decodeFunctionReturn";
import { encodeDeployData } from "src/adapter/utils/encodeDeployData";
import { encodeFunctionData } from "src/adapter/utils/encodeFunctionData";
import { encodeFunctionReturn } from "src/adapter/utils/encodeFunctionReturn";

/**
 * Provides a default implementation of the encoding and decoding methods of an
 * {@linkcode Adapter}.
 */
export abstract class AbiEncoder implements Partial<Adapter> {
  encodeDeployData<TAbi extends Abi>(
    params: EncodeDeployDataParams<TAbi>,
  ): Bytes {
    return encodeDeployData(params);
  }

  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: EncodeFunctionDataParams<TAbi, TFunctionName>) {
    return encodeFunctionData(params);
  }

  encodeFunctionReturn<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: EncodeFunctionReturnParams<TAbi, TFunctionName>): Bytes {
    return encodeFunctionReturn(params);
  }

  decodeFunctionData<
    TAbi extends Abi = Abi,
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >(params: DecodeFunctionDataParams<TAbi, TFunctionName>) {
    return decodeFunctionData(params);
  }

  decodeFunctionReturn<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >(
    params: DecodeFunctionReturnParams<TAbi, TFunctionName>,
  ): FunctionReturn<TAbi, TFunctionName> {
    return decodeFunctionReturn(params);
  }
}
