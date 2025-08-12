// Core-Launch Smart Contract Addresses
export const CONTRACT_ADDRESSES = {
  NFT_COLLECTION_FACTORY: '0x2823Af7e1F2F50703eD9f81Ac4B23DC1E78B9E53',
  NFT_MARKETPLACE: '0x19E88E3790A43721faD03CD5A68A100E18F40c4E',
  NFT_BIDDING: '0x7a9D78D1E5fe688F80D4C2c06Ca4C0407A967644',
} as const

// Contract ABIs
export const CONTRACT_ABIS = {
  NFT_COLLECTION_FACTORY: require('./abis/NFTCollectionFactory.json'),
  NFT_MARKETPLACE: require('./abis/NFTMarketplace.json'),
  NFT_BIDDING: require('./abis/NFTBidding.json'),
} as const

// Contract Creation Fees
export const CONTRACT_FEES = {
  COLLECTION_CREATION: '0.1', // 0.1 CORE (temporary for testing)
} as const

// Gas Limits
export const GAS_LIMITS = {
  CREATE_COLLECTION: 500000,
  MINT_NFT: 150000,
  TRANSFER_NFT: 100000,
} as const

// Network Configuration
export const NETWORK_CONFIG = {
  CHAIN_ID: 1114, // Core Testnet2
  RPC_URL: 'https://rpc.test2.btcs.network',
  EXPLORER_URL: 'https://scan.test2.btcs.network',
  NATIVE_CURRENCY: {
    name: 'Core',
    symbol: 'CORE',
    decimals: 18,
  },
} as const
