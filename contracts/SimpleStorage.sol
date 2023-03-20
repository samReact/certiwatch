// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract SimpleStorage {
    uint s_number;

    function getNumber() external view returns (uint) {
        return s_number;
    }

    function setNumber(uint _s_number) external {
        s_number = _s_number;
    }
}
