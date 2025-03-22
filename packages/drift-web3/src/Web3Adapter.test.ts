import {
  type Address,
  type Block,
  type DecodedFunctionData,
  type EventLog,
  type FunctionArgs,
  HEX_REGEX,
  type Hash,
  type TransactionReceipt,
} from "@delvtech/drift";
import { erc20, mockErc20, testToken } from "@delvtech/drift/testing";
import { Web3Adapter } from "src/Web3Adapter";
import { describe, expect, it } from "vitest";
import Web3 from "web3";

const { VITE_RPC_URL = "", VITE_TOKEN_ADDRESS = "0x0" } = process.env;
const web3 = new Web3(VITE_RPC_URL);

const address = VITE_TOKEN_ADDRESS as Address;

describe("Web3Adapter", () => {
  it("can be initialized with either a web3 instance or forwarded args", async () => {
    const fromInstance = new Web3Adapter(web3);
    expect(fromInstance.getChainId()).resolves;

    const fromUrl = new Web3Adapter(VITE_RPC_URL);
    expect(fromUrl.getChainId()).resolves;
  });

  it("fetches the chain id", async () => {
    const adapter = new Web3Adapter(web3);
    const chainId = await adapter.getChainId();
    expect(chainId).toBeTypeOf("number");
  });

  it("fetches the current block", async () => {
    const adapter = new Web3Adapter(web3);
    const block = await adapter.getBlock();
    expect(block).toMatchObject({
      number: expect.any(BigInt),
      timestamp: expect.any(BigInt),
    } as Partial<Block>);
  });

  it("fetches account balances", async () => {
    const adapter = new Web3Adapter(web3);
    const balance = await adapter.getBalance({ address });
    expect(balance).toBeTypeOf("bigint");
  });

  it("fetches transactions", async () => {
    const adapter = new Web3Adapter(web3);
    let block = await web3.eth.getBlock();
    while (block.transactions.length === 0) {
      console.log(
        `No transactions in block ${block.number}. Fetching parent block.`,
      );
      block = await web3.eth.getBlock(block.parentHash);
    }
    const tx = await adapter.getTransaction({
      hash: block.transactions[0] as Hash,
    });
    expect(tx).toMatchObject({
      gas: expect.any(BigInt),
      gasPrice: expect.any(BigInt),
      input: expect.any(String),
      nonce: expect.any(BigInt),
      type: expect.any(String),
      value: expect.any(BigInt),
      blockHash: expect.any(String),
      blockNumber: expect.any(BigInt),
      from: expect.any(String),
      hash: expect.any(String),
      to: expect.toBeOneOf([expect.any(String), undefined]),
      transactionIndex: expect.any(BigInt),
    });
  });

  it("returns receipts for waited transactions", async () => {
    const adapter = new Web3Adapter(web3);
    let block = await web3.eth.getBlock();
    while (block.transactions.length === 0) {
      console.log(
        `No transactions in block ${block.number}. Fetching parent block.`,
      );
      block = await web3.eth.getBlock(block.parentHash);
    }
    const tx = await adapter.waitForTransaction({
      hash: block.transactions[0] as Hash,
    });
    expect(tx).toMatchObject({
      blockHash: expect.any(String),
      blockNumber: expect.any(BigInt),
      from: expect.any(String),
      cumulativeGasUsed: expect.any(BigInt),
      effectiveGasPrice: expect.any(BigInt),
      gasUsed: expect.any(BigInt),
      logsBloom: expect.any(String),
      status: expect.stringMatching(/^(success|reverted)$/),
      to: expect.toBeOneOf([expect.any(String), undefined]),
      transactionHash: expect.any(String),
      transactionIndex: expect.any(BigInt),
    } as TransactionReceipt);
  });

  describe("call", () => {
    it("reads from deployed contracts", async () => {
      const adapter = new Web3Adapter(web3);
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
      const adapter = new Web3Adapter(web3);
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
    const adapter = new Web3Adapter(web3);
    const currentBlock = await web3.eth.getBlockNumber();
    const events = await adapter.getEvents({
      abi: erc20.abi,
      address,
      event: "Transfer",
      fromBlock: currentBlock - 100n,
    });
    expect(events).toBeInstanceOf(Array);
    expect(events[0]).toEqual(
      expect.objectContaining({
        args: expect.any(Object),
        blockNumber: expect.any(BigInt),
        data: expect.any(String),
        transactionHash: expect.any(String),
      } as EventLog<typeof erc20.abi, "Transfer">),
    );
  });

  describe("read", () => {
    it("reads from contracts", async () => {
      const adapter = new Web3Adapter(web3);
      const symbol = await adapter.read({
        abi: erc20.abi,
        address,
        fn: "symbol",
      });
      expect(symbol).toBeTypeOf("string");
    });

    it("reads from contracts with args", async () => {
      const adapter = new Web3Adapter(web3);
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
    const adapter = new Web3Adapter(web3);
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

  it("deploys contracts", async () => {
    const adapter = new Web3Adapter(web3);

    const hash = await adapter.deploy({
      abi: testToken.abi,
      bytecode: testToken.bytecode,
      args: {
        decimals_: 18,
        initialSupply: 123n,
      },
    });
    const receipt = await adapter.waitForTransaction({ hash });

    expect(hash).toBeTypeOf("string");
    expect(receipt).toMatchObject({
      contractAddress: expect.stringMatching(HEX_REGEX),
    } satisfies Partial<TransactionReceipt>);
  });

  it("encodes deploy data", async () => {
    const adapter = new Web3Adapter(web3);
    const encoded = adapter.encodeDeployData({
      abi: testToken.abi,
      bytecode: testToken.bytecode,
      args: {
        decimals_: 18,
        initialSupply: 123n,
      },
    });
    expect(encoded).toBeTypeOf("string");
  });

  it("encodes function data", async () => {
    const adapter = new Web3Adapter(web3);
    const encoded = adapter.encodeFunctionData({
      abi: erc20.abi,
      fn: "transfer",
      args: {
        amount: 123n,
        to: address,
      },
    });
    expect(encoded).toBeTypeOf("string");
  });

  it("encodes function return data", async () => {
    const adapter = new Web3Adapter(web3);
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
    const adapter = new Web3Adapter(web3);
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
    } as DecodedFunctionData<typeof erc20.abi, "transfer">);
  });

  it("decodes function return data", async () => {
    const adapter = new Web3Adapter(web3);
    const decoded = adapter.decodeFunctionReturn({
      abi: erc20.abi,
      fn: "balanceOf",
      data: "0x000000000000000000000000000000000000000000000000000000000000007b",
    });
    expect(decoded).toEqual(123n);
  });
});
