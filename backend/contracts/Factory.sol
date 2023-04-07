// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./NFTCollection.sol";

/**
 * @title Factory
 * @author Samir
 * @dev Implements a nft factory
 */
contract Factory is Ownable {
    // ::::::::::EVENTS:::::::::: //
    event CollectionAdded(string _name, string _symbol, address _addr);

    /**
     * @dev add initial collection
     * @param _initialCollection initial collection to be added
     */
    constructor(NFTCollection _initialCollection) {
        NFTCollectionArray.push(_initialCollection);
        emit CollectionAdded(
            _initialCollection.name(),
            _initialCollection.symbol(),
            address(_initialCollection)
        );
    }

    NFTCollection[] public NFTCollectionArray;

    /**
     * @dev Create a new collection
     * @param _name collection's name
     */
    function createCollection(
        string calldata _name,
        string calldata _symbol
    ) external onlyOwner {
        NFTCollection newCollection = new NFTCollection(_name, _symbol);
        NFTCollectionArray.push(newCollection);
        emit CollectionAdded(_name, _symbol, address(newCollection));
    }
}
