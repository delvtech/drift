import { Contract } from "@delvtech/drift";
import { erc20 } from "@delvtech/drift/testing";

const contract = new Contract({
  abi: erc20.abi,
  address: "0xAc37729B76db6438CE62042AE1270ee574CA7571",
  rpcUrl: process.env.RPC_URL,
});

const balance = await contract.read("balanceOf", {
  account: contract.address,
});

console.log("Balance:", balance);
