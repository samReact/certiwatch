![alt text](./client/src/assets/logo-main.png)

Bienvenue sur le projet Web3! Ce projet est une application Web3 qui utilise React et Antd pour le front-end, Express.js pour l'API et Hardhat pour la blockchain. L'objectif de ce projet est de fournir une interface utilisateur pour interagir avec une application décentralisée sur la blockchain Ethereum.

## Installation

1. Cloner le dépôt en local.

2. Dans chaque dossier (client, api et backend), exécuter la commande npm install pour installer les dépendances nécessaires.
3. Configurer les variables d'environnement pour l'API et le backend (voir ci-dessous).

## Configuration

### API

Dans le dossier api, créer un fichier .env avec les variables d'environnement suivantes:

PORT=5000

### Backend

Dans le dossier backend, créer un fichier .env avec les variables d'environnement suivantes:

MNEMONIC=<mnemonic>
INFURA_PROJECT_ID=<project_id>
Remplacer <mnemonic> par votre mnémonique de compte Ethereum et <project_id> par votre ID de projet Infura.

## Utilisation

1. Dans le dossier backend, exécuter la commande npx hardhat node pour lancer un nœud local Ethereum.
2. Dans le dossier backend, exécuter la commande npx hardhat run scripts/deploy.js --network localhost pour déployer les contrats intelligents sur le nœud local.
3. Dans le dossier api, exécuter la commande npm start pour démarrer l'API.
4. Dans le dossier client, exécuter la commande npm start pour démarrer l'application Web3.

## Licence

Ce projet est sous licence MIT. Veuillez consulter le fichier LICENSE pour plus d'informations.
