// Adapter

export {
  MockAdapter,
  type OnDeployParams,
  type OnMulticallParams,
  type OnReadParams,
  type OnSendCallsParams,
  type OnSimulateWriteParams,
  type OnWriteParams,
} from "src/adapter/MockAdapter";

export { createStubBlock } from "src/adapter/utils/testing/createStubBlock";
export {
  createStubEvent,
  createStubEvents,
} from "src/adapter/utils/testing/createStubEvent";
export { createStubTransaction } from "src/adapter/utils/testing/createStubTransaction";
export { createStubTransactionReceipt } from "src/adapter/utils/testing/createStubTransactionReceipt";
export { createStubWalletCallsStatus } from "src/adapter/utils/testing/createStubWalletCallsStatus";

// Client

export {
  createMockClient,
  type MockClient,
  type MockClientOptions,
} from "src/client/MockClient";

export {
  createMockDrift,
  type MockDrift,
} from "src/client/MockDrift";

export {
  MockContract,
  type ContractOnMulticallParams,
  type MockContractClientOptions,
  type MockContractOptions,
} from "src/client/contract/MockContract";

// Artifacts

export { MockERC20 as mockErc20 } from "src/artifacts/MockERC20";
export { TestToken as testToken } from "src/artifacts/TestToken";

// Utils

export { MissingStubError } from "src/utils/testing/StubStore";
export { ALICE, BOB, NANCY } from "src/utils/testing/accounts";
export { randomAddress } from "src/utils/testing/randomAddress";
export { randomHex } from "src/utils/testing/randomHex";
export { randomInt } from "src/utils/testing/randomInt";
export { randomSelection } from "src/utils/testing/randomSelection";
