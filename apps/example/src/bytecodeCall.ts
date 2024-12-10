import { Drift } from "@delvtech/drift";
import { MockErc20Example } from "src/abis/MockErc20Example";

const rpcUrl = process.env.RPC_URL;
const drift = new Drift({ rpcUrl });

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
