// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./NFTCollection.sol";

/**
 * @title Certiwatch
 * @author Samir
 * @dev Implements a nft marketplace
 */
contract Marketplace is Ownable {
    uint public feeRate;
    uint public itemCount;
    address payable public immutable feeAccount;

    struct Expert {
        string name;
        bool authorized;
    }

    enum ItemStatus {
        Pending,
        Approved,
        Certified,
        Published,
        Sold
    }

    struct Item {
        uint itemId;
        IERC721 certificate;
        uint tokenId;
        address payable seller;
        string brand;
        string model;
        string description;
        string serial;
        uint price;
        ItemStatus status;
        string ipfsUrl;
    }

    // NFTCollection[] NFTCollectionArray;
    mapping(address => Expert) experts;
    mapping(uint => Item) public items;

    // ::::::::::EVENTS:::::::::: //

    // event NewCollection(string _name, address _addr, uint timestamp);
    event UpdatedProfitRate(uint _prev, uint _profitRate);
    event ExpertAdded(address indexed _addr, string _name);
    event ItemUpdated(
        uint itemId,
        uint tokenId,
        address payable seller,
        string brand,
        string model,
        string serial,
        ItemStatus status,
        string ipfsUrl
    );

    // ::::::::CONSTRUCTOR:::::::::: //

    /**
     * @dev Set an initial fee rate
     * @param _feeRate percentage profit on each item transfer
     */
    constructor(uint _feeRate) {
        feeAccount = payable(msg.sender);
        feeRate = _feeRate;
    }

    // :::::::GETTERS::::::: //

    /**
     * @dev Return the total price of an item
     * @param _itemId id of the marketplace item we want to get
     * @return uint total price (selling price + marketplace profit)
     */
    function getTotalPrice(uint _itemId) public view returns (uint) {
        return ((items[_itemId].price * (100 + feeRate)) / 100);
    }

    function getExpert(address _addr) external view returns (Expert memory) {
        return experts[_addr];
    }

    // /**
    //  * @dev Create a new nft collection
    //  * @param _name  string, name of the new collection
    //  * @param _symbol  symbol of the new collection
    //  */
    // function createCollection(
    //     string calldata _name,
    //     string calldata _symbol
    // ) external onlyOwner {
    //     NFTCollection newCollection = new NFTCollection(_name, _symbol);
    //     NFTCollectionArray.push(newCollection);
    //     emit NewCollection(_name, address(newCollection), block.timestamp);
    // }

    /**
     * @dev Update profit rate of the marketplace
     * @param _feeRate percentage of the new rate
     */
    function updateProfitRate(uint _feeRate) external onlyOwner {
        require(_feeRate > 0 && _feeRate < 100, "Incorrect rate number");
        feeRate = _feeRate;
        emit UpdatedProfitRate(feeRate, _feeRate);
    }

    /**
     * @dev Add new marketplace item
     * @param _certificate token that will be added
     * @param _tokenId id of the token that will be added
     */
    function addToken(
        IERC721 _certificate,
        uint _tokenId,
        uint _itemId
    ) external {
        Item storage item = items[_itemId];
        _certificate.transferFrom(msg.sender, address(this), _tokenId);
        item.certificate = _certificate;
        item.tokenId = _tokenId;
        item.status = ItemStatus.Published;

        emit ItemUpdated(
            _itemId,
            _tokenId,
            item.seller,
            item.brand,
            item.model,
            item.serial,
            ItemStatus.Published,
            item.ipfsUrl
        );
    }

    function addItem(
        string calldata _brand,
        string calldata _model,
        string calldata _description,
        string calldata _serial,
        uint _price
    ) external {
        require(_price > 0);
        itemCount++;
        Item storage item = items[itemCount];

        items[itemCount] = Item(
            itemCount,
            item.certificate,
            item.tokenId,
            payable(msg.sender),
            _brand,
            _model,
            _description,
            _serial,
            _price,
            ItemStatus.Pending,
            item.ipfsUrl
        );
        emit ItemUpdated(
            itemCount,
            item.tokenId,
            payable(msg.sender),
            _brand,
            _model,
            _serial,
            ItemStatus.Pending,
            item.ipfsUrl
        );
    }

    function updateItem(
        uint _itemId,
        uint _status,
        string calldata _ipfsUrl
    ) external {
        Item storage item = items[_itemId];
        item.status = ItemStatus(_status);
        item.ipfsUrl = _ipfsUrl;
        emit ItemUpdated(
            _itemId,
            item.tokenId,
            item.seller,
            item.brand,
            item.model,
            item.serial,
            ItemStatus(_status),
            _ipfsUrl
        );
    }

    function addExpert(
        address _addr,
        string calldata _name
    ) external onlyOwner {
        require(_addr != address(0));
        require(experts[_addr].authorized != true, "Already registered");
        experts[_addr] = Expert(_name, true);
        emit ExpertAdded(_addr, _name);
    }

    /**
     * @dev buy a marketplace item
     * @param _itemId id of the item that will be bought
     */
    function buyItem(uint _itemId) external payable {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "Doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether");
        require(item.status != ItemStatus.Sold, "Already sold");
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        item.status = ItemStatus.Sold;
        item.certificate.transferFrom(address(this), msg.sender, item.tokenId);

        emit ItemUpdated(
            _itemId,
            item.tokenId,
            payable(msg.sender),
            item.brand,
            item.model,
            item.serial,
            ItemStatus.Sold,
            item.ipfsUrl
        );
    }
}
