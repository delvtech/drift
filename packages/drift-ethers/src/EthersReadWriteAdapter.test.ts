import { HEX_REGEX, type TransactionReceipt } from "@delvtech/drift";
import { testToken } from "@delvtech/drift/testing";
import { JsonRpcProvider } from "ethers";
import { EthersReadWriteAdapter } from "src/EthersReadWriteAdapter";
import { assert, describe, expect, it } from "vitest";

const { VITE_RPC_URL = "http://127.0.0.1:8545", VITE_TOKEN_ADDRESS = "0x0" } =
  process.env;
const provider = new JsonRpcProvider(VITE_RPC_URL);
const signer = await provider.getSigner();

describe("EthersReadWriteAdapter", () => {
  it("deploys contracts", async () => {
    const adapter = new EthersReadWriteAdapter({ provider, signer });

    const hash = await adapter.deploy({
      abi: testToken.abi,
      bytecode: testToken.bytecode,
      args: {
        decimals_: 18,
        initialSupply: 123n,
      },
    });
    const receipt = await adapter.waitForTransaction({ hash });

    assert(HEX_REGEX.test(hash));
    expect(receipt).toMatchObject({
      contractAddress: expect.stringMatching(HEX_REGEX),
    } satisfies Partial<TransactionReceipt>);
  });
});
