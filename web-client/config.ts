const contractInfo = require("../smart-contracts/artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.addr.json");
const contractSpecs = require("../smart-contracts/artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

export const config = {
  blockchain: {
    mode: "development",
    network: {
      "ethereum-goerli": {
        host: process.env.NEXT_PUBLIC_GOERLI_URL || "not-defined",
        chainId: 420,
        networkId: 420,
      },
      "polygon-testnet": {
        host: process.env.NEXT_PUBLIC_POLYGON_MUMBAI_URL || "not-defined",
        chainId: 80001,
        networkId: 80001,
      },
      local: {
        host: process.env.NEXT_PUBLIC_LOCAL_RPC_URL || "not-defined",
        chainId: +process.env.NEXT_PUBLIC_LOCAL_RPC_CHAIN_ID!,
        networkId: +process.env.NEXT_PUBLIC_LOCAL_RPC_CHAIN_ID!,
      },
    },
    contract: {
      name: contractInfo.name,
      addr: contractInfo.addr,
      abi: contractSpecs.abi,
      bytecode: contractSpecs.bytecode,
    },
  },
};

let _ = JSON.parse(JSON.stringify(config));
_.blockchain.contract.abi = `${JSON.stringify(
  _.blockchain.contract.abi
).substring(0, 15)}...`;
_.blockchain.contract.bytecode = `${_.blockchain.contract.bytecode.substring(
  0,
  15
)}...`;

console.debug("global config:", JSON.stringify(_, null, 2));

export default config;
