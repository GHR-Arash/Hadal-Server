
const HDWalletProvider = require("@truffle/hdwallet-provider");
const infuraKey = "d7867e69855b48a48f3c4c8d712e0c13";
const mnemonic = "match crash fortune chimney damage top print frequent square stomach device choice";
module.exports = {
  networks: {
    polygon: {
        provider: () => new HDWalletProvider(mnemonic, `https://polygon-mumbai.infura.io/v3/${infuraKey}`),
        network_id: 80001,
        gas: 5500000,          // Optional, gas limit
        gasPrice: 10000000000, // Optional, gas price in wei (10 Gwei here)
        confirmations: 2,     // Number of confirmations required
        timeoutBlocks: 200,    // Number of blocks before a deployment times out
        skipDryRun: true       
    },
    development: {
      host: "127.0.0.1",
      port: 8545, // Use 8545 for Ganache CLI
      network_id: "*"
    }
},

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0",      // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },
};
