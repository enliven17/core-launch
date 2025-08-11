require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Load private key from environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Validate private key exists
if (!PRIVATE_KEY) {
  throw new Error("❌ PRIVATE_KEY environment variable is required!");
}

// Validate private key format (64 hex characters)
if (!/^[0-9a-fA-F]{64}$/.test(PRIVATE_KEY)) {
  throw new Error("❌ Invalid PRIVATE_KEY format! Must be 64 hex characters.");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    "core-testnet2": {
      url: "https://rpc.test2.btcs.network",
      chainId: 1114,
      accounts: [PRIVATE_KEY],
      gasPrice: 20000000000, // 20 Gwei
    },
    "core-mainnet": {
      url: "https://rpc.coredao.org",
      chainId: 1116,
      accounts: [PRIVATE_KEY],
      gasPrice: 20000000000, // 20 Gwei
    },
    hardhat: {
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: {
      "core-testnet2": "not-needed",
      "core-mainnet": "not-needed",
    },
    customChains: [
      {
        network: "core-testnet2",
        chainId: 1114,
        urls: {
          apiURL: "https://scan.test2.btcs.network/api",
          browserURL: "https://scan.test2.btcs.network",
        },
      },
      {
        network: "core-mainnet",
        chainId: 1116,
        urls: {
          apiURL: "https://scan.coredao.org/api",
          browserURL: "https://scan.coredao.org",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
