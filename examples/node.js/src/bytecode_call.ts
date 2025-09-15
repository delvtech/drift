import {
    createDrift,
    decodeFunctionReturn,
    encodeDeployData,
    encodeFunctionData,
} from "@gud/drift";
import { testToken } from "@gud/drift/testing";

const rpcUrl = process.env.RPC_URL;
const drift = createDrift({ rpcUrl });

// An example of a bytecode, i.e., "deployless", call in which the bytecode of a
// contract is temporarily created to call a function on it.

const deployData = encodeDeployData({
  abi: testToken.abi,
  bytecode: testToken.bytecode,
  args: {
    decimals_: 18,
    initialSupply: 1_500_000n * BigInt(1e18),
  },
});

const callData = encodeFunctionData({
  abi: testToken.abi,
  fn: "totalSupply",
});

const returnData = await drift.call({
  bytecode: deployData,
  data: callData,
});

console.log("response data:", returnData);

if (returnData) {
  const decoded = decodeFunctionReturn({
    abi: testToken.abi,
    fn: "totalSupply",
    data: returnData,
  });

  console.log("decoded:", decoded);
}
