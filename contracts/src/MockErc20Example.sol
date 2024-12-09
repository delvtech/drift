// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.24;

import {MockERC20} from "forge-std/mocks/MockERC20.sol";

/**
 * @title MockErc20Example
 * @notice
 */
contract MockErc20Example is MockERC20 {
    constructor() MockERC20() {
        initialize("MockERC20Example", "ME", 18);
    }
}
