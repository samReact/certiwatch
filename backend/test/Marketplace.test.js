const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');

function fromWei(value) {
  return ethers.utils.formatEther(value);
}

function toWei(value) {
  return ethers.utils.parseUnits(value.toString(), 'ether');
}

describe('Marketplace', async () => {
  let owner,
    addr1,
    addr2,
    addr3,
    marketplace,
    nftCollection,
    feeRate,
    NFTCollection;
  let item = {
    itemId: 1,
    brand: 'Rolex',
    model: 'Submariner',
    description: 'Nice watch !',
    serial: '123N28',
    price: '12',
    status: 0
  };
  let URI = 'ipfs://fakeurl';
  const addr0 = ethers.constants.AddressZero;
  const ipfsUrl = 'ipfs://QmSzWD14GEZT4tmZTSHe26LPkjgakFgVSi486uKAq6dxD3';
  feeRate = 1;
  beforeEach(async () => {
    const Marketplace = await ethers.getContractFactory('Marketplace');
    NFTCollection = await ethers.getContractFactory('NFTCollection');

    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    marketplace = await Marketplace.deploy(feeRate);
    nftCollection = await NFTCollection.deploy('Certiwatch', 'CWT');
    await marketplace.deployed();
    await nftCollection.deployed();
  });

  describe('Deployment', () => {
    it('Should return the initial feeAccount of the marketplace', async () => {
      expect(await marketplace.feeAccount()).to.equal(owner.address);
    });
    it('Should return the initial feeRate of the marketplace', async () => {
      expect(await marketplace.feeRate()).to.equal(feeRate);
    });
    it('Should return the correct name and symbol of inital collection', async () => {
      expect(await nftCollection.name()).to.equal('Certiwatch');
      expect(await nftCollection.symbol()).to.equal('CWT');
    });
  });

  describe('Add Expert', function () {
    let tx;
    beforeEach(async () => {
      tx = marketplace.connect(owner).addExpert(addr1.address, 'Samir');
    });
    it('Revert if call by non owner', async () => {
      let tx = marketplace.connect(addr1).addExpert(addr1.address, 'Samir');
      await expect(tx).to.be.revertedWith('Ownable: caller is not the owner');
    });
    it('Revert if call by address 0', async () => {
      let tx = marketplace.connect(owner).addExpert(addr0, 'Samir');
      await expect(tx).to.be.reverted;
    });
    it('Revert if already registered', async () => {
      let tx = marketplace.connect(owner).addExpert(addr1.address, 'Samir');
      await expect(tx).to.be.revertedWith('Already registered');
    });
    it('Emit ExertAdded event', async () => {
      await expect(tx)
        .to.emit(marketplace, 'ExpertAdded')
        .withArgs(addr1.address, 'Samir');
    });
  });

  describe('Profit Rate', () => {
    let newRate = 2;
    let tx;
    beforeEach(async () => {
      tx = await marketplace.updateProfitRate(newRate);
    });
    it('Revert if call by non owner', async () => {
      let tx = marketplace.connect(addr1).updateProfitRate(newRate);
      await expect(tx).to.be.revertedWith('Ownable: caller is not the owner');
    });
    it('Revert if rate is > 100', async () => {
      let tx = marketplace.updateProfitRate(120);
      await expect(tx).to.be.revertedWith('Incorrect rate number');
    });
    it('Track the new setted value', async () => {
      expect(await marketplace.feeRate()).to.equal(newRate);
    });
    it('Emit an UpdatedProfitRate event', async () => {
      await expect(tx)
        .to.emit(marketplace, 'UpdatedProfitRate')
        .withArgs(feeRate, 2);
    });
  });

  describe('Add Item', function () {
    let tx;
    beforeEach(async () => {
      tx = await marketplace
        .connect(addr1)
        .addItem(
          item.brand,
          item.model,
          item.description,
          item.serial,
          item.price
        );
    });
    it('Revert if price is not > 0', async () => {
      let tx = marketplace.addItem(
        item.brand,
        item.model,
        item.description,
        item.serial,
        0
      );
      await expect(tx).to.be.revertedWith('Incorrect price');
    });
    it('Increment items by 1', async () => {
      let itemCount = await marketplace.itemCount();
      expect(itemCount).to.be.equal(1);
    });
    it('Item has pending status', async () => {
      const item = await marketplace.items(1);
      expect(item.status).to.be.equal(0);
    });

    it('Emit ItemUpdated event', async () => {
      await expect(tx)
        .to.emit(marketplace, 'ItemUpdated')
        .withArgs(
          1,
          0,
          addr1.address,
          item.brand,
          item.model,
          item.serial,
          item.status
        );
    });
  });

  describe('Update Item', function () {
    let tx;
    beforeEach(async () => {
      await marketplace.connect(owner).addExpert(addr1.address, 'Samir');
      tx = await marketplace
        .connect(addr2)
        .addItem(
          item.brand,
          item.model,
          item.description,
          item.serial,
          item.price
        );
    });
    it('Revert if unauthorized', async () => {
      let tx = marketplace.connect(addr2).updateItem(item.itemId, 1, ipfsUrl);
      await expect(tx).to.be.revertedWith('Not Authorized');
    });
    it('Revert if incorrect itemId', async () => {
      let tx = marketplace
        .connect(owner)
        .updateItem(item.itemId + 1, 1, ipfsUrl);
      await expect(tx).to.be.revertedWith("Doesn't exist");
    });
    it('Set an expert if status = 2', async () => {
      await marketplace.connect(addr1).updateItem(1, 2, ipfsUrl);
      let item = await marketplace.items(1);
      expect(item.expert).to.be.equal(addr1.address);
    });
    it('Set a new status', async () => {
      await marketplace.connect(addr1).updateItem(1, 2, ipfsUrl);
      let item = await marketplace.items(1);
      expect(item.status).to.be.equal(2);
    });

    it('Emit ItemUpdated event', async () => {
      await expect(tx)
        .to.emit(marketplace, 'ItemUpdated')
        .withArgs(
          1,
          0,
          addr2.address,
          item.brand,
          item.model,
          item.serial,
          item.status
        );
    });
  });
  describe('Get total price', function () {
    let tx;
    beforeEach(async () => {
      tx = await marketplace
        .connect(addr2)
        .addItem(
          item.brand,
          item.model,
          item.description,
          item.serial,
          item.price
        );
    });
    it('Return correct total price', async () => {
      const item = await marketplace.items(1);
      const totalPrice = (item.price * (100 + feeRate)) / 100;
      let tx = await marketplace.getTotalPrice(item.itemId);
      expect(tx).to.be.equal(parseInt(totalPrice));
    });
    it('Revert if call with incorrect id', async () => {
      const count = await marketplace.itemCount();
      let tx = marketplace.getTotalPrice(count + 1);
      await expect(tx).to.be.revertedWith("Doesn't exist");
    });
  });

  describe('Add to whitelist', () => {
    let tx;
    beforeEach(async () => {
      tx = nftCollection.connect(owner).addToWhitelist(addr2.address);
    });
    it('Revert if non owner', async () => {
      let tx = nftCollection.connect(addr1).addToWhitelist(addr2.address);
      await expect(tx).to.be.revertedWith('Ownable: caller is not the owner');
    });
    it('Emit WhitelistAdded event', async () => {
      await expect(tx)
        .to.emit(nftCollection, 'WhitelistAdded')
        .withArgs(addr2.address);
    });
  });
  describe('Mint Item', () => {
    let tx;
    beforeEach(async () => {
      await nftCollection.connect(owner).addToWhitelist(addr2.address);
      tx = await nftCollection.connect(addr2).mintItem(URI);
    });
    it('Revert if non whitelisted', async () => {
      let tx = nftCollection.connect(addr1).mintItem(URI);
      await expect(tx).to.be.revertedWith('Not Authorized');
    });
    it('Track minted Certificate', async () => {
      expect(await nftCollection.tokenIds()).to.equal(1);
      expect(await nftCollection.balanceOf(addr2.address)).to.equal(1);
      expect(await nftCollection.tokenURI(1)).to.equal(URI);
    });
    it('Track each minted Certificate', async () => {
      await nftCollection.connect(addr2).mintItem(URI);
      expect(await nftCollection.tokenIds()).to.equal(2);
      expect(await nftCollection.balanceOf(addr2.address)).to.equal(2);
      expect(await nftCollection.tokenURI(2)).to.equal(URI);
    });
    it('Emit ItemMinted event', async () => {
      await expect(tx)
        .to.emit(nftCollection, 'ItemMinted')
        .withArgs(addr2.address, 1, URI);
    });
  });

  describe('Add Token', function () {
    let tx;
    beforeEach(async () => {
      await nftCollection.connect(owner).addToWhitelist(addr2.address);
      await nftCollection.connect(addr2).mintItem(URI);
      await nftCollection
        .connect(addr2)
        .setApprovalForAll(marketplace.address, true);
      await marketplace
        .connect(addr2)
        .addItem(
          item.brand,
          item.model,
          item.description,
          item.serial,
          item.price
        );
      await marketplace
        .connect(addr3)
        .addItem(
          item.brand,
          item.model,
          item.description,
          item.serial,
          item.price
        );

      tx = marketplace.connect(addr2).addToken(nftCollection.address, 1, 1);
    });
    it('Revert if not seller', async () => {
      const tx = marketplace
        .connect(addr1)
        .addToken(nftCollection.address, 1, 1);
      await expect(tx).to.be.revertedWith('Not Authorized');
    });
    it('Revert if provide invalid tokenID', async () => {
      const tx = marketplace
        .connect(addr2)
        .addToken(nftCollection.address, 2, 1);
      await expect(tx).to.be.revertedWith('ERC721: invalid token ID');
    });
    it('Revert if incorrect owner', async () => {
      const tx = marketplace
        .connect(addr3)
        .addToken(nftCollection.address, 1, 2);
      await expect(tx).to.be.revertedWith(
        'ERC721: transfer from incorrect owner'
      );
    });

    it('Marketplace must be appoved for all', async () => {
      let tx = await nftCollection.isApprovedForAll(
        addr2.address,
        marketplace.address
      );
      expect(tx).to.be.true;
    });

    it('Emit ItemUpdated event', async () => {
      await expect(tx)
        .to.emit(marketplace, 'ItemUpdated')
        .withArgs(1, 1, addr2.address, item.brand, item.model, item.serial, 3);
    });
  });

  describe('Buy Item', () => {
    let tx,
      initialSellBalance,
      initialFeeAccountBalance,
      totalPrice,
      initialExpertBalance;

    beforeEach(async () => {
      await nftCollection.connect(owner).addToWhitelist(addr1.address);
      await nftCollection.connect(addr1).mintItem(URI);
      await nftCollection
        .connect(addr1)
        .setApprovalForAll(marketplace.address, true);
      await marketplace
        .connect(addr1)
        .addItem(
          item.brand,
          item.model,
          item.description,
          item.serial,
          toWei(item.price)
        );
      await marketplace.addExpert(addr3.address, 'Samir');
      await marketplace.connect(addr3).updateItem(1, 2, URI);
      await marketplace.connect(addr1).addToken(nftCollection.address, 1, 1);

      initialBuyBalance = await addr2.getBalance();
      initialFeeAccountBalance = await owner.getBalance();
      initialExpertBalance = await addr3.getBalance();
      initialSellBalance = await addr1.getBalance();
      totalPrice = await marketplace.getTotalPrice(1);
      tx = await marketplace.connect(addr2).buyItem(1, {
        value: totalPrice
      });
    });
    it('Seller and feeAccount receive payment', async function () {
      const finalFeeAccountBlalance = await owner.getBalance();
      const finalSellBalance = await addr1.getBalance();
      const fee = ((feeRate / 100) * item.price) / 2;

      expect(+fromWei(finalFeeAccountBlalance)).to.equal(
        +fee + +fromWei(initialFeeAccountBalance)
      );

      expect(+fromWei(finalSellBalance)).to.equal(
        +item.price + +fromWei(initialSellBalance)
      );
    });

    it('Expert receive payment', async function () {
      const finalExpertBalance = await addr3.getBalance();
      const fee = ((feeRate / 100) * item.price) / 2;

      expect(+fromWei(finalExpertBalance)).to.equal(
        +fee + +fromWei(initialExpertBalance)
      );
    });

    it('Buyer is new nft owner', async function () {
      expect(await nftCollection.ownerOf(1)).to.equal(addr2.address);
    });
    it('Item status is sold', async function () {
      expect((await marketplace.items(1)).status).to.equal(4);
    });
    it('Fail for invalid item', async function () {
      const tx = marketplace.connect(addr2).buyItem(3, {
        value: toWei(item.price)
      });
      await expect(tx).to.be.revertedWith("Doesn't exist");
    });

    it('Emit ItemUpdated event', async () => {
      await expect(tx)
        .to.emit(marketplace, 'ItemUpdated')
        .withArgs(1, 1, addr2.address, item.brand, item.model, item.serial, 4);
    });
  });
});
