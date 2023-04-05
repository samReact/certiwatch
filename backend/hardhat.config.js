require('@nomicfoundation/hardhat-toolbox');
/** @type import('hardhat/config').HardhatUserConfig */

require('dotenv').config();

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
      accounts: {
        mnemonic: `${process.env.MNEMONIC}`
      },
      chainId: 5
    }
  },
  solidity: '0.8.19',
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
