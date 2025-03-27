import {
  type Address,
  type Block,
  type DecodedFunctionData,
  type EventLog,
  type FunctionArgs,
  HEX_REGEX,
  type Hash,
  type Transaction,
  type TransactionReceipt,
} from "@delvtech/drift";
import { erc20, mockErc20, testToken } from "@delvtech/drift/testing";
import { JsonRpcProvider } from "ethers";
import { EthersReadAdapter } from "src/EthersReadAdapter";
import { assert, describe, expect, it } from "vitest";

const { VITE_RPC_URL = "", VITE_TOKEN_ADDRESS = "0x0" } = process.env;
const provider = new JsonRpcProvider(VITE_RPC_URL);

const address = VITE_TOKEN_ADDRESS as Address;

describe("EthersReadAdapter", () => {
  it("can be initialized with either a provider instance or RPC url", async () => {
    const fromInstance = new EthersReadAdapter({ provider });
    expect(fromInstance.getChainId()).resolves;
    const fromUrl = new EthersReadAdapter({ provider: VITE_RPC_URL });
    expect(fromUrl.getChainId()).resolves;
  });

  it("fetches the chain id", async () => {
    const adapter = new EthersReadAdapter({ provider });
    const chainId = await adapter.getChainId();
    expect(chainId).toBeTypeOf("number");
  });

  it("fetches the current block", async () => {
    const adapter = new EthersReadAdapter({ provider });
    const block = await adapter.getBlock();
    expect(block).toMatchObject({
      number: expect.any(BigInt),
      timestamp: expect.any(BigInt),
    } satisfies Partial<Block>);
  });

  it("fetches account balances", async () => {
    const adapter = new EthersReadAdapter({ provider });
    const balance = await adapter.getBalance({ address });
    expect(balance).toBeTypeOf("bigint");
  });

  it("fetches transactions", async () => {
    const adapter = new EthersReadAdapter({ provider });
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
      chainId: expect.toBeOneOf([undefined, expect.any(Number)]),
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
    const adapter = new EthersReadAdapter({ provider });
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
      const adapter = new EthersReadAdapter({ provider });
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
      const adapter = new EthersReadAdapter({ provider });
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
    const adapter = new EthersReadAdapter({ provider });
    const currentBlock = await provider.getBlockNumber();
    const events = await adapter.getEvents({
      abi: erc20.abi,
      address,
      event: "Transfer",
      fromBlock: BigInt(currentBlock - 100),
    });
    expect(events).toBeInstanceOf(Array);
    expect(events[0]).toMatchObject({
      eventName: "Transfer",
      args: expect.any(Object),
      blockNumber: expect.any(BigInt),
      data: expect.stringMatching(HEX_REGEX),
      transactionHash: expect.stringMatching(HEX_REGEX),
    } satisfies EventLog<typeof erc20.abi, "Transfer">);
  });

  describe("read", () => {
    it("reads from contracts", async () => {
      const adapter = new EthersReadAdapter({ provider });
      const symbol = await adapter.read({
        abi: erc20.abi,
        address,
        fn: "symbol",
      });
      expect(symbol).toBeTypeOf("string");
    });

    it("reads from contracts with args", async () => {
      const adapter = new EthersReadAdapter({ provider });
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
    const adapter = new EthersReadAdapter({ provider });
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
    const adapter = new EthersReadAdapter({ provider });
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
    const adapter = new EthersReadAdapter({ provider });
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
    const adapter = new EthersReadAdapter({ provider });
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
    const adapter = new EthersReadAdapter({ provider });
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
    const adapter = new EthersReadAdapter({ provider });
    const decoded = adapter.decodeFunctionReturn({
      abi: erc20.abi,
      fn: "balanceOf",
      data: "0x000000000000000000000000000000000000000000000000000000000000007b",
    });
    expect(decoded).toEqual(123n);
  });
});
