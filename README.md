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

PORT=5000

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
npm start
```

4. In the client folder, run the command below command to start the Web3 application.

```bash
npm run dev
```

## Tests

1. In backend folder, run this command to run tests

```bash
npx hardhat test
```

## License

This project is licensed under the MIT License. Please see the LICENSE file for more information.

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
