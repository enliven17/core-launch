// Core Chain Types
export interface CoreChainConfig {
  chainId: number
  rpcUrl: string
  explorerUrl: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

// NFT Types
export interface NFTMetadata {
  name: string
  description?: string
  image: string
  external_url?: string
  attributes?: NFTAttribute[]
  collection?: {
    name: string
    family: string
  }
}

export interface NFTAttribute {
  trait_type: string
  value: string | number
  display_type?: 'number' | 'boost_percentage' | 'boost_number' | 'date'
}

export interface NFT {
  id: string
  tokenId: string
  contractAddress: string
  metadata: NFTMetadata
  owner: string
  creator: string
  createdAt: Date
  updatedAt: Date
  price?: string
  isListed: boolean
  collectionId: string
}

// Collection Types
export interface CollectionMetadata {
  name: string
  symbol: string
  description?: string
  coverImage: string
  bannerImage?: string
  website?: string
  twitter?: string
  discord?: string
  telegram?: string
  github?: string
}

export interface Collection {
  id: string
  contractAddress: string
  metadata: CollectionMetadata
  creator: string
  createdAt: Date
  updatedAt: Date
  totalSupply: number
  maxSupply?: number
  isVerified: boolean
  royaltyPercentage: number
  floorPrice?: string
  totalVolume: string
  nftCount: number
}

// Form Types
export interface CreateCollectionForm {
  name: string
  symbol: string
  description?: string
  coverImage: File | null
  bannerImage?: File | null
  website?: string
  twitter?: string
  discord?: string
  telegram?: string
  github?: string
  maxSupply?: number
  royaltyPercentage: number
}

export interface CreateNFTForm {
  name: string
  description?: string
  image: File | null
  collectionId: string
  attributes?: NFTAttribute[]
  price?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Upload Types
export interface UploadResponse {
  url: string
  key: string
  size: number
  mimeType: string
}

// Wallet Types
export interface WalletInfo {
  address: string
  balance: string
  network: string
  isConnected: boolean
}

// Transaction Types
export interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  gasUsed: string
  gasPrice: string
  status: 'pending' | 'success' | 'failed'
  blockNumber?: number
  timestamp: Date
}

// Error Types
export interface ValidationError {
  field: string
  message: string
}

export interface ApiError {
  code: string
  message: string
  details?: any
}

// UI Types
export interface LoadingState {
  isLoading: boolean
  message?: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

// Filter Types
export interface CollectionFilters {
  search?: string
  creator?: string
  isVerified?: boolean
  sortBy?: 'createdAt' | 'name' | 'floorPrice' | 'totalVolume'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface NFTFilters {
  search?: string
  collectionId?: string
  owner?: string
  creator?: string
  priceMin?: string
  priceMax?: string
  attributes?: Record<string, string | number>
  sortBy?: 'createdAt' | 'name' | 'price' | 'tokenId'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
