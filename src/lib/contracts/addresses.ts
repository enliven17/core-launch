// Deployed contract addresses on Core Blockchain Testnet2
export const CONTRACT_ADDRESSES = {
  NFT_COLLECTION_FACTORY: "0xAaFE053F1D8402282c839aeb595218F30aa7DCC6",
  // Add other contract addresses here as they are deployed
} as const;

// Network configuration
export const NETWORK_CONFIG = {
  chainId: 1114,
  chainName: "Core Blockchain Testnet2",
  rpcUrl: "https://rpc.test2.btcs.network",
  explorerUrl: "https://scan.testnet2.coredao.org",
  nativeCurrency: {
    name: "CORE",
    symbol: "CORE",
    decimals: 18,
  },
} as const;
