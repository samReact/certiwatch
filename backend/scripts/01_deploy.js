const { artifacts } = require('hardhat');
const hre = require('hardhat');

async function main() {
  const NFTCollection = await hre.ethers.getContractFactory('NFTCollection');
  const Marketplace = await hre.ethers.getContractFactory('Marketplace');
  const Factory = await hre.ethers.getContractFactory('Factory');

  const nftCollection = await NFTCollection.deploy(
    'Certiwatch collection',
    'CWT'
  );
  const marketplace = await Marketplace.deploy(1);
  const factory = await Factory.deploy(nftCollection.address);

  await nftCollection.deployed();
  await marketplace.deployed();
  await factory.deployed();

  saveClientFiles(nftCollection, 'NFTCollection');
  saveClientFiles(marketplace, 'Marketplace');
  saveClientFiles(factory, 'Factory');

  console.log(`NFTCollection deployed to ${nftCollection.address}`);
  console.log(`Marketplace deployed to ${marketplace.address}`);
  console.log(`Factory deployed to ${factory.address}`);
}

function saveClientFiles(contract, name) {
  const fs = require('fs');
  const contractsDir = __dirname + '/../../client/src/contractsData';

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
