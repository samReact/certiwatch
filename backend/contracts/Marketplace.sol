// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is ReentrancyGuard, Ownable {
    address payable public immutable feeAccount;
    uint public profitRate;
    uint public itemCount;

    struct Item {
        uint itemId;
        IERC721 certificate;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    event ItemAdded(
        uint itemId,
        address indexed certificate,
        uint tokenId,
        uint price,
        address indexed seller
    );

    event UpdatedProfitRate(uint prev, uint profitRate);

    event ItemBought(
        uint itemId,
        address indexed certificate,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    mapping(uint => Item) public items;

    constructor(uint _profitRate) {
        feeAccount = payable(msg.sender);
        profitRate = _profitRate;
    }

    function updateProfitRate(uint _profitRate) external onlyOwner {
        require(_profitRate > 0 && _profitRate < 100);
        profitRate = _profitRate;
        emit UpdatedProfitRate(profitRate, _profitRate);
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
        return ((items[_itemId].price * (100 + profitRate)) / 100);
    }
}
