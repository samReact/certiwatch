// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTCollection
 * @author Samir
 * @dev Implements a nft collection
 */
contract NFTCollection is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public tokenIds;

    // ::::::::::EVENTS:::::::::: //

    event WhitelistAdded(address _addr);
    event ItemMinted(address _addr, uint _tokenId, string _tokenURI);

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Not Authorized");
        _;
    }

    mapping(address => bool) public whitelist;

    /**
     * @dev Set acollection name and symbol an each new instance
     * @param _name name of the new collection
     * @param _symbol symbol of the new collection
     */
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    /**
     * @dev Modifier to check if caller is whitelisted
     */

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Mint a new collection token
     * @param _tokenURI  ipfs uri of the token
     * @return uint minted token id
     */
    function mintItem(
        string memory _tokenURI
    ) public onlyWhitelisted returns (uint256) {
        tokenIds.increment();
        _safeMint(msg.sender, tokenIds.current());
        _setTokenURI(tokenIds.current(), _tokenURI);
        emit ItemMinted(msg.sender, tokenIds.current(), _tokenURI);
        return tokenIds.current();
    }

    function addToWhitelist(address _addr) external onlyOwner {
        whitelist[_addr] = true;
        emit WhitelistAdded(_addr);
    }
}
