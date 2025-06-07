// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

/**
 * @title Overloaded
 * @notice A contract for testing overloaded function handling.
 */
contract Overloaded {
    constructor() {}

    uint256 public callCount;

    function diffArgs(uint256 a) public returns (uint256) {
        callCount++;
        return a;
    }

    function diffArgs(uint256 a, string memory b) public returns (string memory) {
        callCount++;
        if (a > 0) return b; // To ignore warning about unused variable 'a'
        return b;
    }

    function diffArgNames(uint256 num) public returns (uint256) {
        callCount++;
        return num;
    }

    function diffArgNames(string memory name) public returns (string memory) {
        callCount++;
        return name;
    }

    function sameArgNames(uint256 a) public returns (uint256) {
        callCount++;
        return a;
    }

    function sameArgNames(string memory a) public returns (string memory) {
        callCount++;
        return a;
    }
}

/**
 * @title Overloaded1
 * @notice A contract containing only the first signatures of the overloaded
 *    functions for verification in tests.
 */
contract Overloaded1 {
    function diffArgs(uint256 a) public pure returns (uint256) {
        return a;
    }

    function diffArgNames(uint256 num) public pure returns (uint256) {
        return num;
    }

    function sameArgNames(uint256 a) public pure returns (uint256) {
        return a;
    }
}

/**
 * @title Overloaded2
 * @notice A contract containing only the second signatures of the overloaded
 *    functions for verification in tests.
 */
contract Overloaded2 {
    function diffArgs(uint256 a, string memory b) public pure returns (string memory) {
        if (a > 0) return b; // To ignore warning about unused variable 'a'
        return b;
    }

    function diffArgNames(string memory name) public pure returns (string memory) {
        return name;
    }

    function sameArgNames(string memory a) public pure returns (string memory) {
        return a;
    }
}
