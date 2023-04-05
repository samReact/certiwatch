const { expect } = require('chai');

describe('Factory', async () => {
  let owner, addr1, nftCollection, factory, NFTCollection, Factory;

  beforeEach(async () => {
    Factory = await ethers.getContractFactory('Factory');
    NFTCollection = await ethers.getContractFactory('NFTCollection');

    nftCollection = await NFTCollection.deploy('Certiwatch', 'CWT');
    factory = await Factory.deploy(nftCollection.address);

    [owner, addr1] = await ethers.getSigners();
    await nftCollection.deployed();
    await factory.deployed();
  });

  describe('Deployment', () => {
    it('Should add initial collection', async () => {
      const collection = await factory.NFTCollectionArray(0);
      expect(collection).to.be.equal(nftCollection.address);
    });
  });
  describe('Add new collection', () => {
    let tx;
    beforeEach(async () => {
      tx = await factory.createCollection('2pac', 'NWA');
    });
    it('Revert if call by non owner', async () => {
      let tx = factory.connect(addr1).createCollection('2pac', 'NWA');
      await expect(tx).to.be.revertedWith('Ownable: caller is not the owner');
    });
    it('Should add a collection', async () => {
      const collection = await factory.NFTCollectionArray(1);
      expect(ethers.utils.isAddress(collection)).to.be.true;
    });
    it('Emit CollectionAdded event', async () => {
      const collection = await factory.NFTCollectionArray(1);
      await expect(tx)
        .to.emit(factory, 'CollectionAdded')
        .withArgs('2pac', 'NWA', collection);
    });
  });
});
