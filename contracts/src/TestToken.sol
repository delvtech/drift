// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import {MockERC20} from "forge-std/mocks/MockERC20.sol";

/**
 * @title TestToken
 * @notice An example ERC20 contract for use in tests.
 */
contract TestToken is MockERC20 {
    constructor(uint256 initialSupply, uint8 decimals_) MockERC20() {
        initialize("Test Token", "TEST", decimals_);
        _mint(msg.sender, initialSupply);
    }
}
