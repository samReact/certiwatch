require('@nomicfoundation/hardhat-toolbox');
/** @type import('hardhat/config').HardhatUserConfig */

require('hardhat-gas-reporter');

require('dotenv').config();

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
      gas: 3000
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
      accounts: {
        mnemonic: `${process.env.MNEMONIC}`
      },
      gas: 3000,
      chainId: 5
    }
  },

  gasReporter: {
    enabled: true
  },
  solidity: '0.8.19',
  settings: {
    optimizer: {
      enabled: false,
      runs: 400
    }
  }
};
