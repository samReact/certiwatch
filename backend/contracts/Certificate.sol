// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Certificate is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter public tokenIds;

    constructor() ERC721("Certiwatch certificates", "CWT") {}

    function mintItem(string memory _tokenURI) public returns (uint256) {
        tokenIds.increment();
        _safeMint(msg.sender, tokenIds.current());
        _setTokenURI(tokenIds.current(), _tokenURI);
        return tokenIds.current();
    }
}
