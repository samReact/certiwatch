require('@nomicfoundation/hardhat-toolbox');
require('hardhat-abi-exporter');
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337
    }
  },
  solidity: '0.8.19',
  abiExporter: {
    path: '../client/abi',
    runOnCompile: true,
    clear: true,
    flat: true
  }
};
