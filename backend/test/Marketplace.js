const {
  time,
  loadFixture
} = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');

describe('Marketplace', async () => {
  let owner, addr1, addr2, certificate, marketplace;
  let feePercent = 1;
  let URI = 'ipfs://fakeurl';

  beforeEach(async () => {
    const Marketplace = await ethers.getContractFactory('Marketplace');
    const Certificate = await ethers.getContractFactory('Certificate');

    [owner, addr1, addr2] = await ethers.getSigners();
    certificate = await Certificate.deploy();
    marketplace = await Marketplace.deploy(feePercent);
  });

  describe('Deployment', () => {
    it('Should return the correct name and symbol of nft collection', async () => {
      expect(await certificate.name()).to.equal('Certiwatch certificates');
      expect(await certificate.symbol()).to.equal('CWT');
    });
    it('Should return the initial feePercent and feeAccount of the marketplace', async () => {
      expect(await marketplace.feeAccount()).to.equal(owner.address);
      expect(await marketplace.feePercent()).to.equal(feePercent);
    });
  });

  describe('Minting NFTs', () => {
    it('Should track each minted Certificate', async () => {
      await certificate.connect(addr1).mintItem(URI);
      expect(await certificate.tokenIds()).to.equal(1);
      expect(await certificate.balanceOf(addr1.address)).to.equal(1);
      expect(await certificate.tokenURI(1)).to.equal(URI);

      await certificate.connect(addr2).mintItem(URI);
      expect(await certificate.tokenIds()).to.equal(2);
      expect(await certificate.balanceOf(addr2.address)).to.equal(1);
      expect(await certificate.tokenURI(2)).to.equal(URI);
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
});
