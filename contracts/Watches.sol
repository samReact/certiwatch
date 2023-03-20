// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Watches is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Certiwatch certificates", "CWT") {}

    function mintItem(
        address _to,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        uint256 newItemId = _tokenIds.current();
        _mint(_to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _tokenIds.increment();
        return newItemId;
    }
}
