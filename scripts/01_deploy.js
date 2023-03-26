// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { artifacts } = require('hardhat');
const hre = require('hardhat');

async function main() {
  const Certificate = await hre.ethers.getContractFactory('Certificate');
  const certificate = await Certificate.deploy();

  await certificate.deployed();

  saveClientFiles(certificate, 'Certificate');

  console.log(`Certificate deployed to ${certificate.address}`);
}

function saveClientFiles(contract, name) {
  const fs = require('fs');
  const contractsDir = __dirname + '/../client/contractsData';

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync('Certificate');

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
