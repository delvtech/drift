import {
  MockContract,
  type MockContractParams,
} from "src/client/Contract/MockContract";
import { IERC20 } from "src/utils/testing/IERC20";

type Erc20Abi = typeof IERC20.abi;

export type MockErc20Params = Omit<MockContractParams<Erc20Abi>, "abi">;

export class MockErc20 extends MockContract<Erc20Abi> {
  constructor(params?: MockErc20Params) {
    super({
      ...params,
      abi: IERC20.abi,
    });
  }
}
