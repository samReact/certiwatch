const {
  time,
  loadFixture
} = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');

describe('Marketplace', async () => {
  let owner, addr1, addr2, factory, nftCollection, feeRate, NFTCollection;
  let URI = 'ipfs://fakeurl';

  beforeEach(async () => {
    const Marketplace = await ethers.getContractFactory('Marketplace');
    NFTCollection = await ethers.getContractFactory('NFTCollection');
    feeRate = 1;

    [owner, addr1, addr2] = await ethers.getSigners();
    marketplace = await Marketplace.deploy(feeRate);
    nftCollection = await NFTCollection.deploy('Certiwatch', 'CWT');
  });

  describe('Deployment', () => {
    it('Should return the initial feeAccount of the marketplace', async () => {
      expect(await marketplace.feeAccount()).to.equal(owner.address);
    });
    it('Should return the initial feeAccount of the marketplace', async () => {
      expect(await marketplace.feeRate()).to.equal(feeRate);
    });
    it('Should return the correct name and symbol of inital collection', async () => {
      expect(await nftCollection.name()).to.equal('Certiwatch');
      expect(await nftCollection.symbol()).to.equal('CWT');
    });
  });

  // describe('Create new collections', () => {
  //   let address1, newCollection, instance1;

  //   beforeEach(async () => {
  //     newCollection = await marketplace.createCollection('2pacs', 'NWA');
  //     address1 = await marketplace.NFTCollectionArray(0);
  //     instance1 = await NFTCollection.attach(address1);
  //   });

  //   it('Should return the correct name and symbol of new collection 1', async () => {
  //     expect(await instance1.name()).to.equal('2pac');
  //     expect(await instance1.symbol()).to.equal('NWA');
  //   });

  //   it('Should emit NewCollection events', async () => {
  //     await expect(newCollection)
  //       .to.emit(marketplace, 'NewCollection')
  //       .withArgs('2pac', address1, anyValue);
  //   });
  // });

  describe('Profit Rate', () => {
    it('Should has an initial value', async () => {
      expect(await marketplace.feeRate()).to.equal(feeRate);
    });
    describe('Setting a new value', async () => {
      let newRate = 2;
      let tx;

      beforeEach(async () => {
        tx = await marketplace.updateProfitRate(newRate);
      });
      it('Should revert if call by non owner', async () => {
        let tx = marketplace.connect(addr1).updateProfitRate(newRate);
        await expect(tx).to.be.revertedWith('Ownable: caller is not the owner');
      });
      it('Should revert if rate is > 100', async () => {
        let tx = marketplace.updateProfitRate(120);
        await expect(tx).to.be.revertedWith('Incorrect rate number');
      });
      it('Should track the new setted value', async () => {
        expect(await marketplace.feeRate()).to.equal(newRate);
      });
      it('Should emit an UpdatedProfitRate event', async () => {
        expect(tx)
          .to.emit(marketplace, 'UpdatedProfisstRate')
          .withArgs(feeRate, newRate);
      });
    });
  });

  describe('Minting NFTs', () => {
    it('Should track each minted Certificate', async () => {
      await nftCollection.connect(addr1).mintItem(URI);
      expect(await nftCollection.tokenIds()).to.equal(1);
      expect(await nftCollection.balanceOf(addr1.address)).to.equal(1);
      expect(await nftCollection.tokenURI(1)).to.equal(URI);

      await nftCollection.connect(addr2).mintItem(URI);
      expect(await nftCollection.tokenIds()).to.equal(2);
      expect(await nftCollection.balanceOf(addr2.address)).to.equal(1);
      expect(await nftCollection.tokenURI(2)).to.equal(URI);
    });
  });

  describe('Add items to marketplace', () => {
    beforeEach(async () => {
      await certificate.connect(addr1).mintItem(URI);
      await certificate
        .connect(addr1)
        .setApprovalForAll(marketplace.address, true);
    });
  });

  describe('Add a new proposal', () => {
    let tx;
    beforeEach(async () => {
      tx = await marketplace
        .connect(addr2)
        .addProposal('Rolex', 'Submariner', 'jolie montre', '123', 12);
    });
    it('Should emit a ProposalUpdated event', async () => {
      await expect(tx)
        .to.emit(marketplace, 'ProposalUpdated')
        .withArgs(
          1,
          addr2.address,
          'Rolex',
          'Submariner',
          'jolie montre',
          '123',
          12,
          0
        );
    });
  });
});
