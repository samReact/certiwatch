const hre = require('hardhat');

async function main() {
  const Factory = await hre.ethers.getContractFactory('Factory');
  const addressPath =
    __dirname + '/../../client/src/contractsData/Factory-address.json';

  const { address } = require(addressPath);
  try {
    const contract = await Factory.attach(address);
    await contract.createCollection('FromScript', 'SRC');
    return 'success';
  } catch (error) {
    console.error(error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
