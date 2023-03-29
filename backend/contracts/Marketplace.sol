// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NFTCollection.sol";

contract Marketplace is ReentrancyGuard, Ownable {
    NFTCollection[] public NFTCollectionArray;
    uint public feeRate;
    uint public itemCount;
    address payable public immutable feeAccount;

    struct Item {
        uint itemId;
        IERC721 certificate;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    mapping(uint => Item) public items;

    // EVENTS

    event NewCollection(string _name, address _addr, uint timestamp);

    event UpdatedProfitRate(uint prev, uint profitRate);

    event ItemAdded(
        uint itemId,
        address indexed certificate,
        uint tokenId,
        uint price,
        address indexed seller
    );

    event ItemBought(
        uint itemId,
        address indexed certificate,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    // CONSTRUCTOR

    constructor(uint _feeRate) {
        feeAccount = payable(msg.sender);
        feeRate = _feeRate;
    }

    // FUNCTIONS

    function createCollection(
        string calldata _name,
        string calldata _symbol
    ) external {
        NFTCollection newCollection = new NFTCollection(_name, _symbol);
        NFTCollectionArray.push(newCollection);
        emit NewCollection(_name, address(newCollection), block.timestamp);
    }

    function updateProfitRate(uint _feeRate) external onlyOwner {
        require(_feeRate > 0 && _feeRate < 100, "Incorrect rate number");
        feeRate = _feeRate;
        emit UpdatedProfitRate(feeRate, _feeRate);
    }

    function addItem(
        IERC721 _certificate,
        uint _tokenId,
        uint _price
    ) external nonReentrant {
        require(_price > 0);
        itemCount++;
        _certificate.transferFrom(msg.sender, address(this), _tokenId);

        items[itemCount] = Item(
            itemCount,
            _certificate,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );

        emit ItemAdded(
            itemCount,
            address(_certificate),
            _tokenId,
            _price,
            msg.sender
        );
    }

    function buyItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "Doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether");
        require(!item.sold, "Already sold");
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        item.sold = true;
        item.certificate.transferFrom(address(this), msg.sender, item.tokenId);

        emit ItemBought(
            _itemId,
            address(item.certificate),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }

    function getTotalPrice(uint _itemId) public view returns (uint) {
        return ((items[_itemId].price * (100 + feeRate)) / 100);
    }
}
