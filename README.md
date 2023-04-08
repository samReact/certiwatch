![alt text](./client/src/assets/logo-main.png)

---

_Welcome to the Web3 Project! This project is a Web3 application that uses React and Antd for the front-end, Express.js for the API, and Hardhat for the blockchain. The goal of this project is to provide a user interface for interacting with a decentralized application on the Ethereum blockchain._

## Installation

1. Clone the repository locally.

```bash
git clone
```

2. In each folder (client, api, and backend), run the command npm install to install the necessary dependencies.

```bash
npm install
```

3. Configure environment variables for the API and backend (see below).

## Configuration

### API

In the api folder, create a .env file with the following environment variables:

PINATA_KEY=<pinata_key>
PINATA_SECRET=<pinata_secret>
JWT_SECRET=<jwt_secret>

Replace <pinata_key> and <pinata_secret> with your Pinata account credential, generate a jwt secret phrase for <jwt_secret>.

### Backend

In the backend folder, create a .env file with the following environment variables:

MNEMONIC=<mnemonic>
INFURA_PROJECT_ID=<project_id>

Replace <mnemonic> with your Ethereum account mnemonic and <project_id> with your Infura project ID.

## Utilisation

1. In backend folder start a local Ethereum node.

```bash
npx hardhat node
```

2. In backend folder deploy the smart contracts to the local node

```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. In the api folder, start the API.

```bash
npm run dev
```

api will run in port 5000.

4. In the client folder, run the command below command to start the Web3 application.

```bash
npm run dev
```

client will run in localhost:5173

## Tests

1. In backend folder, run this command to run tests

```bash
npx hardhat test
```

or this below command to have your test running with coverage report

```bash
npx hardhat coverage
```

## Dapp movie

Dapp demo movie is available [here:](https://www.loom.com/share/74ae321c69fe4255a993c46096f563b3)

## Public access

Smart contracts are deployed on Sepolia testNet.

- Factory: [0x47C6eC6cc612fc2f4eA63d5522928aE102B23eaD](https://sepolia.etherscan.io/0x47C6eC6cc612fc2f4eA63d5522928aE102B23eaD)
- MarketPlace: [0xaa8eeBA35b64CeCb82E478265163f2c81cd05629](https://sepolia.etherscan.io/0xaa8eeBA35b64CeCb82E478265163f2c81cd05629)
- NFTCollection: [0x63d90d53AF942984860d9e5f928fC9Db5c8C686A](https://sepolia.etherscan.io/0x63d90d53AF942984860d9e5f928fC9Db5c8C686A)

Dapp is available here : https://certiwatch-psi.vercel.app/

## License

This project is licensed under the MIT License. Please see the LICENSE file for more information.
