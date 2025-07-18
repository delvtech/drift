import {
  type Address,
  type Block,
  type DecodedFunctionData,
  DriftError,
  type EventLog,
  type FunctionArgs,
  HEX_REGEX,
  type Hash,
  type MulticallCallResult,
  type Transaction,
  type TransactionReceipt,
  ZERO_ADDRESS,
  erc20,
} from "@delvtech/drift";
import { mockErc20, testToken } from "@delvtech/drift/testing";
import { providers } from "ethers";
import { EthersReadAdapter } from "src/EthersReadAdapter";
import { assert, beforeAll, describe, expect, it } from "vitest";

const { VITE_RPC_URL = "", VITE_TOKEN_ADDRESS = "0x0" } = process.env;
const provider = new providers.JsonRpcProvider(VITE_RPC_URL);
const adapter = new EthersReadAdapter({ provider });
const address = VITE_TOKEN_ADDRESS as Address;

describe("EthersReadAdapter", () => {
  beforeAll(() => {
    expect(
      address,
      "VITE_TOKEN_ADDRESS environment variable must be set to a valid token address",
    ).toBeDefined();
  });

  it("can be initialized with either a provider instance or RPC url", async () => {
    const fromInstance = new EthersReadAdapter({ provider });
    expect(fromInstance.getChainId()).resolves;
    const fromUrl = new EthersReadAdapter({ provider: VITE_RPC_URL });
    expect(fromUrl.getChainId()).resolves;
  });

  it("fetches the chain id", async () => {
    const chainId = await adapter.getChainId();
    expect(chainId).toBeTypeOf("number");
  });

  it("fetches the current block", async () => {
    const block = await adapter.getBlock();
    expect(block).toMatchObject({
      number: expect.any(BigInt),
      timestamp: expect.any(BigInt),
    } satisfies Partial<Block>);
  });

  it("fetches account balances", async () => {
    const balance = await adapter.getBalance({ address });
    expect(balance).toBeTypeOf("bigint");
  });

  it("fetches transactions", async () => {
    let block = await provider.getBlock("latest");
    expect(block).toBeDefined();
    while (block?.transactions.length === 0) {
      console.log(
        `No transactions in block ${block.number}. Fetching parent block.`,
      );
      block = await provider.getBlock(block.parentHash);
    }
    const tx = await adapter.getTransaction({
      hash: block!.transactions[0] as Hash,
    });
    expect(tx).toMatchObject({
      chainId: expect.toBeOneOf([expect.any(Number), undefined]),
      gas: expect.any(BigInt),
      gasPrice: expect.any(BigInt),
      input: expect.stringMatching(HEX_REGEX),
      nonce: expect.any(BigInt),
      value: expect.any(BigInt),
      blockHash: expect.stringMatching(HEX_REGEX),
      blockNumber: expect.any(BigInt),
      from: expect.stringMatching(HEX_REGEX),
      transactionHash: expect.stringMatching(HEX_REGEX),
      to: expect.toBeOneOf([expect.stringMatching(HEX_REGEX), undefined]),
      transactionIndex: undefined,
      type: expect.any(String),
    } satisfies Transaction);
  });

  it("returns receipts for waited transactions", async () => {
    let block = await provider.getBlock("latest");
    expect(block).toBeDefined();
    while (block?.transactions.length === 0) {
      console.log(
        `No transactions in block ${block.number}. Fetching parent block.`,
      );
      block = await provider.getBlock(block.parentHash);
    }
    const tx = await adapter.waitForTransaction({
      hash: block!.transactions[0] as Hash,
    });
    expect(tx).toMatchObject({
      blockHash: expect.stringMatching(HEX_REGEX),
      blockNumber: expect.any(BigInt),
      contractAddress: expect.toBeOneOf([
        expect.stringMatching(HEX_REGEX),
        undefined,
      ]),
      cumulativeGasUsed: expect.any(BigInt),
      effectiveGasPrice: expect.any(BigInt),
      from: expect.stringMatching(HEX_REGEX),
      gasUsed: expect.any(BigInt),
      logsBloom: expect.stringMatching(HEX_REGEX),
      status: expect.stringMatching(/^(success|reverted)$/),
      to: expect.toBeOneOf([expect.stringMatching(HEX_REGEX), undefined]),
      transactionHash: expect.stringMatching(HEX_REGEX),
      transactionIndex: expect.any(BigInt),
    } satisfies TransactionReceipt);
  });

  describe("call", () => {
    it("reads from deployed contracts", async () => {
      const data = adapter.encodeFunctionData({
        abi: erc20.abi,
        fn: "symbol",
      });
      const result = await adapter.call({
        to: address,
        data,
      });
      expect(result).toEqual(expect.stringMatching(/^0x/));
    });

    it("reads from bytecodes", async () => {
      const data = adapter.encodeFunctionData({
        abi: mockErc20.abi,
        fn: "name",
      });
      const result = await adapter.call({
        bytecode: mockErc20.bytecode,
        data,
      });
      expect(result).toEqual(expect.stringMatching(/^0x/));
    });
  });

  describe("multicall", () => {
    it("reads multiple functions from contracts", async () => {
      const [symbolResult, decimalsResult] = await adapter.multicall({
        calls: [
          {
            abi: erc20.abi,
            address,
            fn: "symbol",
          },
          {
            abi: erc20.abi,
            address,
            fn: "decimals",
          },
        ],
      });
      expect(symbolResult).toMatchObject({
        success: true,
        value: expect.any(String),
      } satisfies MulticallCallResult);
      expect(decimalsResult).toMatchObject({
        success: true,
        value: expect.any(Number),
      } satisfies MulticallCallResult);
    });

    it("reads from contracts with args", async () => {
      const [balanceResult, transferResult] = await adapter.multicall({
        calls: [
          {
            abi: erc20.abi,
            address,
            fn: "balanceOf",
            args: { account: address },
          },

          {
            abi: erc20.abi,
            address,
            fn: "allowance",
            args: { owner: address, spender: address },
          },
        ],
      });

      expect(balanceResult).toMatchObject({
        success: true,
        value: expect.any(BigInt),
      } satisfies MulticallCallResult);
      expect(transferResult).toMatchObject({
        success: true,
        value: expect.any(BigInt),
      } satisfies MulticallCallResult);
    });

    it("returns errors for failed calls", async () => {
      const [transferResult] = await adapter.multicall({
        calls: [
          {
            abi: erc20.abi,
            address,
            fn: "transfer",
            args: {
              amount: BigInt(10_000e18),
              to: ZERO_ADDRESS,
            },
          },
        ],
      });

      expect(transferResult).toMatchObject({
        success: false,
        error: expect.any(DriftError),
      } satisfies MulticallCallResult);
    });

    it("returns function values directly when allowFailure is false", async () => {
      const [decimals, symbol] = await adapter.multicall({
        allowFailure: false,
        calls: [
          {
            abi: erc20.abi,
            address,
            fn: "decimals",
          },
          {
            abi: erc20.abi,
            address,
            fn: "symbol",
          },
        ],
      });
      expect(decimals).toBeTypeOf("number");
      expect(symbol).toBeTypeOf("string");
    });
  });

  it("fetches events", async () => {
    const currentBlock = await provider.getBlockNumber();
    const events = await adapter.getEvents({
      abi: erc20.abi,
      address,
      event: "Transfer",
      fromBlock: BigInt(currentBlock - 100),
    });
    expect(events).toBeInstanceOf(Array);
    expect(events[0]).toEqual(
      expect.objectContaining({
        eventName: "Transfer",
        args: expect.any(Object),
        blockNumber: expect.any(BigInt),
        data: expect.stringMatching(HEX_REGEX),
        transactionHash: expect.stringMatching(HEX_REGEX),
      } satisfies EventLog<typeof erc20.abi, "Transfer">),
    );
  });

  describe("read", () => {
    it("reads from contracts", async () => {
      const symbol = await adapter.read({
        abi: erc20.abi,
        address,
        fn: "symbol",
      });
      expect(symbol).toBeTypeOf("string");
    });

    it("reads from contracts with args", async () => {
      const balance = await adapter.read({
        abi: erc20.abi,
        address,
        fn: "balanceOf",
        args: { account: address },
      });
      expect(balance).toBeTypeOf("bigint");
    });
  });

  it("simulates writes to a contracts", async () => {
    const success = await adapter.simulateWrite({
      abi: erc20.abi,
      address,
      fn: "transfer",
      args: {
        amount: 1n,
        to: address,
      },
    });
    expect(success).toBeTypeOf("boolean");
  });

  it("encodes deploy data", async () => {
    const encoded = adapter.encodeDeployData({
      abi: testToken.abi,
      bytecode: testToken.bytecode,
      args: {
        decimals_: 18,
        initialSupply: 123n,
      },
    });
    assert(HEX_REGEX.test(encoded));
  });

  it("encodes function data", async () => {
    const encoded = adapter.encodeFunctionData({
      abi: erc20.abi,
      fn: "transfer",
      args: {
        amount: 123n,
        to: address,
      },
    });
    assert(HEX_REGEX.test(encoded));
  });

  it("encodes function return data", async () => {
    const encoded = adapter.encodeFunctionReturn({
      abi: erc20.abi,
      fn: "balanceOf",
      value: 123n,
    });
    expect(encoded).toEqual(
      "0x000000000000000000000000000000000000000000000000000000000000007b",
    );
  });

  it("decodes function data", async () => {
    const args: FunctionArgs<typeof erc20.abi, "transfer"> = {
      amount: 123n,
      to: address,
    };
    const decoded = adapter.decodeFunctionData({
      abi: erc20.abi,
      fn: "transfer",
      data: adapter.encodeFunctionData({
        abi: erc20.abi,
        fn: "transfer",
        args,
      }),
    });
    expect(decoded).toMatchObject({
      args,
      functionName: "transfer",
    } satisfies DecodedFunctionData<typeof erc20.abi, "transfer">);
  });

  it("decodes function return data", async () => {
    const decoded = adapter.decodeFunctionReturn({
      abi: erc20.abi,
      fn: "balanceOf",
      data: "0x000000000000000000000000000000000000000000000000000000000000007b",
    });
    expect(decoded).toEqual(123n);
  });
});
