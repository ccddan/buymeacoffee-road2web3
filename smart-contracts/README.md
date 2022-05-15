# Buy Me A Coffee - Smart Contracts

## Requirements

- NodeJS >= 16.15.0

## Deployment

```bash
$ npm install

$ npx run lint
$ npm run compile

$ npx hardhat node # for local development only
$ npm test

$ npx hardhat run scripts/deploy.ts --network {localhost|goerli}
$ npx hardhat verify --network {localhost|goerli} {DEPLOYED_CONTRACT_ADDRESS}

$ npm run artifacts
```
