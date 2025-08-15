import { CoreChainConfig } from '../types'

// Core Chain Testnet2 Configuration
export const CORE_CHAIN_CONFIG: CoreChainConfig = {
  chainId: 1114, // Core Testnet2
  rpcUrl: process.env.CORE_RPC_URL || 'https://rpc.test2.btcs.network',
  explorerUrl: 'https://scan.testnet2.coredao.org',
  nativeCurrency: {
    name: 'Core',
    symbol: 'CORE',
    decimals: 18,
  },
}

// Core Chain Mainnet Configuration (for future use)
export const CORE_MAINNET_CONFIG: CoreChainConfig = {
  chainId: 1116, // Core Mainnet
  rpcUrl: 'https://rpc.coredao.org',
  explorerUrl: 'https://scan.coredao.org',
  nativeCurrency: {
    name: 'Core',
    symbol: 'CORE',
    decimals: 18,
  },
}

// Get current chain configuration based on environment
export function getCurrentChainConfig(): CoreChainConfig {
  const isTestnet = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_CHAIN_ID === '1115'
  return isTestnet ? CORE_CHAIN_CONFIG : CORE_MAINNET_CONFIG
}

// Network switching utilities
export const SUPPORTED_CHAINS = [
  {
    id: CORE_CHAIN_CONFIG.chainId,
    name: 'Core Testnet2',
    network: 'testnet2',
    nativeCurrency: CORE_CHAIN_CONFIG.nativeCurrency,
    rpcUrls: {
      default: { http: [CORE_CHAIN_CONFIG.rpcUrl] },
      public: { http: [CORE_CHAIN_CONFIG.rpcUrl] },
    },
    blockExplorers: {
      default: { name: 'CoreScan', url: CORE_CHAIN_CONFIG.explorerUrl },
    },
  },
  {
    id: CORE_MAINNET_CONFIG.chainId,
    name: 'Core Mainnet',
    network: 'mainnet',
    nativeCurrency: CORE_MAINNET_CONFIG.nativeCurrency,
    rpcUrls: {
      default: { http: [CORE_MAINNET_CONFIG.rpcUrl] },
      public: { http: [CORE_MAINNET_CONFIG.rpcUrl] },
    },
    blockExplorers: {
      default: { name: 'CoreScan', url: CORE_MAINNET_CONFIG.explorerUrl },
    },
  },
]

// Gas estimation utilities
export const GAS_LIMITS = {
  CREATE_COLLECTION: 500000, // Estimated gas for collection creation
  MINT_NFT: 150000, // Estimated gas for NFT minting
  TRANSFER_NFT: 100000, // Estimated gas for NFT transfer
  APPROVE_NFT: 50000, // Estimated gas for NFT approval
}

// Transaction defaults
export const TRANSACTION_DEFAULTS = {
  gasLimit: GAS_LIMITS.MINT_NFT,
  maxFeePerGas: '20000000000', // 20 Gwei
  maxPriorityFeePerGas: '2000000000', // 2 Gwei
}

// Error messages
export const CORE_CHAIN_ERRORS = {
  INSUFFICIENT_FUNDS: 'Insufficient CORE balance for transaction',
  USER_REJECTED: 'Transaction was rejected by user',
  NETWORK_ERROR: 'Network error occurred',
  CONTRACT_ERROR: 'Smart contract error occurred',
  INVALID_CHAIN: 'Please switch to Core Chain network',
}

// Network validation
export function isValidCoreChain(chainId: number): boolean {
  return [CORE_CHAIN_CONFIG.chainId, CORE_MAINNET_CONFIG.chainId].includes(chainId)
}

// Format CORE amount
export function formatCORE(amount: string, decimals: number = 18): string {
  const value = parseFloat(amount) / Math.pow(10, decimals)
  return value.toFixed(4)
}

// Parse CORE amount
export function parseCORE(amount: string, decimals: number = 18): string {
  const value = parseFloat(amount) * Math.pow(10, decimals)
  return value.toString()
}
