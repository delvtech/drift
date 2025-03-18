// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

/**
 * @title CodeCaller
 * @notice A contract that temporarily deploys a contract and calls it.
 */
contract CodeCaller {
    error BytecodeDeploymentFailed();

    constructor(bytes memory bytecode, bytes memory callParams) {
        // Deploy the contract with the create opcode
        address deployed;
        assembly {
            deployed := create(0, add(bytecode, 32), mload(bytecode))
        }

        // Revert if the deployment failed
        if (deployed == address(0) || deployed.code.length == 0) {
            revert BytecodeDeploymentFailed();
        }

        // Call the deployed contract
        (bool success, bytes memory returnData) = deployed.call(callParams);

        // Forward the return data
        assembly {
            if iszero(success) { revert(add(returnData, 32), mload(returnData)) }
            return(add(returnData, 32), mload(returnData))
        }
    }
}
