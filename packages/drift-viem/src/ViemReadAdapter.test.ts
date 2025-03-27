import {
  type Block,
  type DecodedFunctionData,
  type EventLog,
  type FunctionArgs,
  HEX_REGEX,
  type Transaction,
  type TransactionReceipt,
} from "@delvtech/drift";
import { mockErc20, testToken } from "@delvtech/drift/testing";
import { ViemReadAdapter } from "src/ViemReadAdapter";
import { http, type Address, createPublicClient, erc20Abi } from "viem";
import { assert, describe, expect, it } from "vitest";

const { VITE_RPC_URL = "", VITE_TOKEN_ADDRESS = "0x0" } = process.env;
const publicClient = createPublicClient({
  transport: http(VITE_RPC_URL),
});

const address = VITE_TOKEN_ADDRESS as Address;

describe("ViemReadAdapter", () => {
  it("fetches the chain id", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    const chainId = await adapter.getChainId();
    expect(chainId).toBeTypeOf("number");
  });

  it("fetches the current block", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    const block = await adapter.getBlock();
    expect(block).toMatchObject({
      number: expect.any(BigInt),
      timestamp: expect.any(BigInt),
    } satisfies Partial<Block>);
  });

  it("fetches account balances", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    const balance = await adapter.getBalance({ address });
    expect(balance).toBeTypeOf("bigint");
  });

  it("fetches transactions", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    let block = await publicClient.getBlock();
    while (block.transactions.length === 0) {
      console.log(
        `No transactions in block ${block.number}. Fetching parent block.`,
      );
      block = await publicClient.getBlock({ blockHash: block.parentHash });
    }
    const tx = await adapter.getTransaction({
      hash: block.transactions[0]!,
    });
    expect(tx).toMatchObject({
      chainId: expect.toBeOneOf([expect.any(Number), undefined]),
      gas: expect.any(BigInt),
      gasPrice: expect.any(BigInt),
      input: expect.stringMatching(HEX_REGEX),
      nonce: expect.any(BigInt),
      type: expect.any(String),
      value: expect.any(BigInt),
      blockHash: expect.stringMatching(HEX_REGEX),
      blockNumber: expect.any(BigInt),
      from: expect.stringMatching(HEX_REGEX),
      transactionHash: expect.stringMatching(HEX_REGEX),
      to: expect.toBeOneOf([expect.stringMatching(HEX_REGEX), undefined]),
      transactionIndex: expect.any(BigInt),
    } satisfies Transaction);
  });

  it("returns receipts for waited transactions", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    let block = await publicClient.getBlock();
    while (block.transactions.length === 0) {
      console.log(
        `No transactions in block ${block.number}. Fetching parent block.`,
      );
      block = await publicClient.getBlock({ blockHash: block.parentHash });
    }
    const tx = await adapter.waitForTransaction({
      hash: block.transactions[0]!,
    });
    expect(tx).toMatchObject({
      contractAddress: expect.toBeOneOf([
        expect.stringMatching(HEX_REGEX),
        undefined,
      ]),
      to: expect.toBeOneOf([expect.stringMatching(HEX_REGEX), undefined]),
      blockHash: expect.stringMatching(HEX_REGEX),
      blockNumber: expect.any(BigInt),
      from: expect.stringMatching(HEX_REGEX),
      cumulativeGasUsed: expect.any(BigInt),
      effectiveGasPrice: expect.any(BigInt),
      gasUsed: expect.any(BigInt),
      logsBloom: expect.stringMatching(HEX_REGEX),
      status: expect.stringMatching(/^(success|reverted)$/),
      transactionHash: expect.stringMatching(HEX_REGEX),
      transactionIndex: expect.any(BigInt),
    } satisfies TransactionReceipt);
  });

  describe("call", () => {
    it("reads from deployed contracts", async () => {
      const adapter = new ViemReadAdapter({ publicClient });
      const data = adapter.encodeFunctionData({
        abi: erc20Abi,
        fn: "symbol",
      });
      const result = await adapter.call({
        to: address,
        data,
      });
      expect(result).toEqual(expect.stringMatching(/^0x/));
    });

    it("reads from bytecodes", async () => {
      const adapter = new ViemReadAdapter({ publicClient });
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

  it("fetches events", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    const currentBlock = await publicClient.getBlockNumber();
    const events = await adapter.getEvents({
      abi: erc20Abi,
      address,
      event: "Transfer",
      fromBlock: currentBlock - 100n,
    });
    expect(events).toBeInstanceOf(Array);
    expect(events[0]).toMatchObject({
      eventName: "Transfer",
      args: expect.any(Object),
      blockNumber: expect.any(BigInt),
      data: expect.stringMatching(HEX_REGEX),
      transactionHash: expect.stringMatching(HEX_REGEX),
    } satisfies EventLog<typeof erc20Abi, "Transfer">);
  });

  describe("read", () => {
    it("reads from contracts", async () => {
      const adapter = new ViemReadAdapter({ publicClient });
      const symbol = await adapter.read({
        abi: erc20Abi,
        address,
        fn: "symbol",
      });
      expect(symbol).toBeTypeOf("string");
    });

    it("reads from contracts with args", async () => {
      const adapter = new ViemReadAdapter({ publicClient });
      const balance = await adapter.read({
        abi: erc20Abi,
        address,
        fn: "balanceOf",
        args: { account: address },
      });
      expect(balance).toBeTypeOf("bigint");
    });
  });

  it("simulates writes to a contracts", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    const balance = await adapter.simulateWrite({
      abi: erc20Abi,
      address,
      fn: "transfer",
      args: {
        amount: 1n,
        recipient: address,
      },
    });
    expect(balance).toBeTypeOf("boolean");
  });

  it("encodes deploy data", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
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
    const adapter = new ViemReadAdapter({ publicClient });
    const encoded = adapter.encodeFunctionData({
      abi: erc20Abi,
      fn: "transfer",
      args: {
        amount: 123n,
        recipient: address,
      },
    });
    assert(HEX_REGEX.test(encoded));
  });

  it("encodes function return data", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    const encoded = adapter.encodeFunctionReturn({
      abi: erc20Abi,
      fn: "balanceOf",
      value: 123n,
    });
    expect(encoded).toEqual(
      "0x000000000000000000000000000000000000000000000000000000000000007b",
    );
  });

  it("decodes function data", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    const args: FunctionArgs<typeof erc20Abi, "transfer"> = {
      amount: 123n,
      recipient: address,
    };
    const decoded = adapter.decodeFunctionData({
      abi: erc20Abi,
      fn: "transfer",
      data: adapter.encodeFunctionData({
        abi: erc20Abi,
        fn: "transfer",
        args,
      }),
    });
    expect(decoded).toEqual({
      args,
      functionName: "transfer",
    } satisfies DecodedFunctionData<typeof erc20Abi, "transfer">);
  });

  it("decodes function return data", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    const decoded = adapter.decodeFunctionReturn({
      abi: erc20Abi,
      fn: "balanceOf",
      data: "0x000000000000000000000000000000000000000000000000000000000000007b",
    });
    expect(decoded).toEqual(123n);
  });
});
