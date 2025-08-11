# Core-Launch Smart Contracts

This directory contains the smart contracts for the Core-Launch NFT platform.

## Contracts Overview

### 1. NFTCollectionFactory.sol
- Creates new NFT collections
- Manages collection deployment
- Handles collection metadata

### 2. NFTCollection.sol
- Individual NFT collection contract
- ERC-721 implementation
- Minting and management functions

### 3. NFTMarketplace.sol
- NFT trading and listing
- Royalty distribution
- Price discovery

## Deployment

### Prerequisites
- Core Testnet2 CORE tokens for gas fees
- Private key for deployment
- Hardhat or Foundry development environment

### Environment Variables
```bash
# ⚠️  NEVER commit your actual private key!
PRIVATE_KEY=your_private_key_here
CORE_RPC_URL=https://rpc.test2.btcs.network
CHAIN_ID=1114
```

### Deployment Steps
1. Install dependencies: `npm install`
2. Compile contracts: `npx hardhat compile`
3. Deploy to testnet: `npx hardhat run scripts/deploy.js --network core-testnet2`

## Contract Addresses (After Deployment)
- NFTCollectionFactory: `0x...`
- NFTMarketplace: `0x...`

## Verification
Contracts can be verified on CoreScan Testnet2:
https://scan.testnet2.coredao.org
