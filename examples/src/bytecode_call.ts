import { createDrift } from "@delvtech/drift";
import { MockErc20Example } from "src/abis/MockErc20Example";

const rpcUrl = process.env.RPC_URL;
const drift = createDrift({ rpcUrl });

// An example of a bytecode, i.e., "deployless", call in which the bytecode of a
// contract is temporarily created to call a function on it.

const data = await drift.call({
  bytecode: MockErc20Example.bytecode,
  data: drift.encodeFunctionData({
    abi: MockErc20Example.abi,
    fn: "name",
  }),
});

console.log("response data:", data);

if (data) {
  const decoded = drift.decodeFunctionReturn({
    abi: MockErc20Example.abi,
    fn: "name",
    data,
  });
  console.log("decoded:", decoded);
}
