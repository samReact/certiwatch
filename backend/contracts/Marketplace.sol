// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./NFTCollection.sol";

/**
 * @title Certiwatch
 * @author Samir
 * @dev Implements a nft marketplace
 */
contract Marketplace is Ownable, ReentrancyGuard {
    using SafeMath for uint;

    // ::::::::::STATE:::::::::: //

    uint public feeRate;
    uint public itemCount;
    address payable public immutable feeAccount;

    // ::::::::::EVENTS:::::::::: //

    event UpdatedProfitRate(uint _prev, uint _profitRate);
    event ExpertAdded(address indexed _addr, string _name);
    event ItemUpdated(
        uint itemId,
        uint tokenId,
        address payable seller,
        string brand,
        string model,
        string serial,
        ItemStatus status
    );

    // :::::::MODIFIERS::::::: //

    /**
     * @dev Modifier to check if caller is the seller
     * @param _itemId item's id
     */
    modifier onlySeller(uint _itemId) {
        require(items[_itemId].seller == msg.sender, "Not Authorized");
        _;
    }

    /**
     * @dev Modifier to check if caller is the seller or the owner
     */
    modifier onlyAuthorized() {
        require(
            experts[msg.sender].authorized == true || msg.sender == owner(),
            "Not Authorized"
        );
        _;
    }

    /**
     * @dev Modifier to check if an item exist and not sold
     * @param _itemId item's id
     */
    modifier onlyValid(uint _itemId) {
        require(_itemId > 0 && _itemId <= itemCount, "Doesn't exist");
        require(items[_itemId].status != ItemStatus.Sold, "Already sold");
        _;
    }

    struct Expert {
        string name;
        bool authorized;
    }

    struct Item {
        uint itemId;
        IERC721 certificate;
        uint tokenId;
        address payable seller;
        address payable expert;
        string brand;
        string model;
        string description;
        string serial;
        uint price;
        ItemStatus status;
        string ipfsUrl;
    }

    enum ItemStatus {
        Pending,
        Approved,
        Certified,
        Published,
        Sold
    }

    mapping(address => Expert) public experts;
    mapping(uint => Item) public items;

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
    function getTotalPrice(
        uint _itemId
    ) public view onlyValid(_itemId) returns (uint) {
        return ((items[_itemId].price * (100 + feeRate)) / 100);
    }

    // :::::::ADD FUNCTIONS::::::: //

    /**
     * @dev Add an authorized expert to a marketplace
     * @param _addr expert's eth address
     * @param _name expert's name
     */
    function addExpert(
        address payable _addr,
        string calldata _name
    ) external onlyOwner {
        require(_addr != address(0));
        require(experts[_addr].authorized != true, "Already registered");
        experts[_addr] = Expert(_name, true);
        emit ExpertAdded(_addr, _name);
    }

    /**
     * @dev Transfer token's seller to marketplace and publish ads
     * @param _certificate token that will be added
     * @param _tokenId id of the token that will be added
     */
    function addToken(
        IERC721 _certificate,
        uint _tokenId,
        uint _itemId
    ) external onlySeller(_itemId) nonReentrant {
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
            ItemStatus.Published
        );
    }

    /**
     * @dev Add token to a marketplace item
     * @param _brand watch's brand
     * @param _model watch's model
     * @param _description watch's descrition
     * @param _serial watch's serial number
     * @param _price watch's price
     */
    function addItem(
        string calldata _brand,
        string calldata _model,
        string calldata _description,
        string calldata _serial,
        uint _price
    ) external {
        require(_price > 0, "Incorrect price");
        itemCount++;
        Item storage item = items[itemCount];

        items[itemCount] = Item(
            itemCount,
            item.certificate,
            item.tokenId,
            payable(msg.sender),
            item.expert,
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
            ItemStatus.Pending
        );
    }

    // :::::::UPDATE FUNCTIONS::::::: //

    /**
     * @dev Update an existing item
     * @param _itemId item's id
     * @param _status new status index
     * @param _ipfsUrl associated certificate ipfs url
     */
    function updateItem(
        uint _itemId,
        uint _status,
        string calldata _ipfsUrl
    ) external onlyAuthorized onlyValid(_itemId) {
        Item storage item = items[_itemId];
        address payable newExpert;
        if (_status == 2) {
            newExpert = payable(msg.sender);
        }
        item.expert = newExpert;
        item.status = ItemStatus(_status);
        item.ipfsUrl = _ipfsUrl;
        emit ItemUpdated(
            _itemId,
            item.tokenId,
            item.seller,
            item.brand,
            item.model,
            item.serial,
            ItemStatus(_status)
        );
    }

    /**
     * @dev Update profit rate of the marketplace
     * @param _feeRate percentage of the new rate
     */
    function updateProfitRate(uint _feeRate) external onlyOwner {
        require(_feeRate > 0 && _feeRate < 100, "Incorrect rate number");
        uint prevFeeRate = feeRate;
        feeRate = _feeRate;
        emit UpdatedProfitRate(prevFeeRate, _feeRate);
    }

    /**
     * @dev buy a marketplace item
     * @param _itemId id of the item that will be bought
     */
    function buyItem(
        uint _itemId
    ) external payable nonReentrant onlyValid(_itemId) {
        Item storage item = items[_itemId];
        uint _totalPrice = getTotalPrice(_itemId);
        uint profit = _totalPrice.sub(item.price).div(2);
        require(msg.value >= _totalPrice, "Not enough ether");
        (bool sellerSuccess, ) = item.seller.call{value: item.price}("");
        (bool expertSuccess, ) = item.expert.call{value: profit}("");
        (bool feeAccountSuccess, ) = feeAccount.call{value: profit}("");
        require(
            sellerSuccess && expertSuccess && feeAccountSuccess,
            "Transfer fail"
        );
        item.status = ItemStatus.Sold;
        item.certificate.transferFrom(address(this), msg.sender, item.tokenId);
        emit ItemUpdated(
            _itemId,
            item.tokenId,
            payable(msg.sender),
            item.brand,
            item.model,
            item.serial,
            ItemStatus.Sold
        );
    }
}
