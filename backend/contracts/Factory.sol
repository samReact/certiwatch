// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
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

    constructor(NFTCollection _initialCollection) {
        NFTCollectionArray.push(_initialCollection);
        emit CollectionAdded(
            _initialCollection.name(),
            _initialCollection.symbol(),
            address(_initialCollection)
        );
    }

    NFTCollection[] public NFTCollectionArray;

    function createCollection(
        string calldata _name,
        string calldata _symbol
    ) external onlyOwner {
        NFTCollection newCollection = new NFTCollection(_name, _symbol);
        NFTCollectionArray.push(newCollection);
        emit CollectionAdded(_name, _symbol, address(newCollection));
    }
}
