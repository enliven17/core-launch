# Core-Launch Smart Contracts Documentation

## 📋 Overview
This documentation contains all deployed smart contracts and their details for the Core-Launch project.

## 🌐 Network Information
- **Network**: Core Blockchain Testnet2
- **Chain ID**: 1114
- **RPC URL**: https://rpc.test2.btcs.network
- **Explorer**: https://scan.test2.btcs.network
- **Native Currency**: CORE (18 decimals)

## 🚀 Deployed Contracts

### 1. NFT Collection Factory
**Contract**: `NFTCollectionFactory.sol`
- **Address**: `0xAaFE053F1D8402282c839aeb595218F30aa7DCC6` *(OLD - DEPRECATED)*
- **Purpose**: Factory contract for creating NFT collections
- **Features**:
  - Collection creation
  - Collection count tracking
  - Collection listing
- **Deployment Date**: 2025-01-11
- **Status**: ❌ Deprecated - Replaced by new version
- **Explorer**: [View Contract](https://scan.test2.btcs.network/address/0xAaFE053F1D8402282c839aeb595218F30aa7DCC6)

### 1.1. NFT Collection Factory (NEW)
**Contract**: `NFTCollectionFactory.sol` *(Updated Version)*
- **Address**: `0x0E90a99b22Cc5b281FF52f418BAe4ec909a7F5fb`
- **Purpose**: Factory contract for creating NFT collections with public minting support
- **Features**:
  - Collection creation (1 CORE fee)
  - Collection count tracking
  - Collection listing
  - **NEW**: Automatic public minting setup (0.5 CORE mint price)
  - **NEW**: Enhanced minting controls
- **Deployment Date**: 2025-01-12
- **Status**: ✅ Active - Current version
- **Collection Creation Fee**: 1 CORE
- **Default Mint Price**: 0.5 CORE
- **Explorer**: [View Contract](https://scan.test2.btcs.network/address/0x0E90a99b22Cc5b281FF52f418BAe4ec909a7F5fb)

### 1.2. NFT Collection Factory (LATEST)
**Contract**: `NFTCollectionFactory.sol` *(Latest Version - 0.1 CORE Fee)*
- **Address**: `0x2823Af7e1F2F50703eD9f81Ac4B23DC1E78B9E53`
- **Purpose**: Factory contract for creating NFT collections with reduced fees
- **Features**:
  - Collection creation (0.1 CORE fee) - **REDUCED FEE**
  - Collection count tracking
  - Collection listing
  - **NEW**: Automatic public minting setup (0.5 CORE mint price)
  - **NEW**: Enhanced minting controls
  - **NEW**: Fixed setMintPrice issue
- **Deployment Date**: 2025-01-12
- **Status**: ✅ Active - Latest version
- **Collection Creation Fee**: 0.1 CORE *(Reduced from 1 CORE)*
- **Default Mint Price**: 0.5 CORE
- **Explorer**: [View Contract](https://scan.test2.btcs.network/address/0x2823Af7e1F2F50703eD9f81Ac4B23DC1E78B9E53)

### 2. NFT Marketplace
**Contract**: `NFTMarketplace.sol`
- **Address**: `0x19E88E3790A43721faD03CD5A68A100E18F40c4E`
- **Purpose**: NFT listing and purchasing marketplace
- **Features**:
  - NFT listing
  - NFT purchasing
  - Price updates
  - Listing cancellation
- **Platform Fee**: 2.5%
- **Deployment Date**: 2025-01-11
- **Explorer**: [View Contract](https://scan.test2.btcs.network/address/0x19E88E3790A43721faD03CD5A68A100E18F40c4E)

### 3. NFT Bidding
**Contract**: `NFTBidding.sol`
- **Address**: `0x7a9D78D1E5fe688F80D4C2c06Ca4C0407A967644`
- **Purpose**: Bidding system for NFTs
- **Features**:
  - Start bidding
  - Place bids
  - Bid history
  - Accept bids
  - Cancel bidding
- **Platform Fee**: 1%
- **Min Duration**: 1 hour
- **Deployment Date**: 2025-01-11
- **Explorer**: [View Contract](https://scan.test2.btcs.network/address/0x7a9D78D1E5fe688F80D4C2c06Ca4C0407A967644)

## 🎨 Sample NFT Collections

### 1. Core Launch Test Collection (CLTC)
**Contract**: `NFTCollection.sol`
- **Address**: `0x5b8564DC0BB802C86787C60479eC8D7EB038Fb93`
- **Name**: Core Launch Test Collection
- **Symbol**: CLTC
- **Max Supply**: 1,000 NFTs
- **Royalty**: 5%
- **Creator**: `0x71197e7a1CA5A2cb2AD82432B924F69B1E3dB123`
- **Minted NFTs**: 4
- **Explorer**: [View Contract](https://scan.test2.btcs.network/address/0x5b8564DC0BB802C86787C60479eC8D7EB038Fb93)

### 2. Digital Art Masters (DAM)
**Contract**: `NFTCollection.sol`
- **Address**: `0x38DC4a41C05AdB41C923c6d912947817E0932957`
- **Name**: Digital Art Masters
- **Symbol**: DAM
- **Max Supply**: 500 NFTs
- **Royalty**: 10%
- **Creator**: `0x71197e7a1CA5A2cb2AD82432B924F69B1E3dB123`
- **Minted NFTs**: 3
- **Explorer**: [View Contract](https://scan.test2.btcs.network/address/0x38DC4a41C05AdB41C923c6d912947817E0932957)

### 3. Gaming Legends (GL)
**Contract**: `NFTCollection.sol`
- **Address**: `0x06aB3506fe4B2b0EA048d06A4aEE848F83340290`
- **Name**: Gaming Legends
- **Symbol**: GL
- **Max Supply**: Unlimited (∞)

### 4. Core Launch Public Collection (CLPC) - NEW
**Contract**: `NFTCollection.sol` *(Latest Factory)*
- **Address**: `0xdE4AfE2a9646299b97e35C0B3C50D04cCb74Bf3a`
- **Name**: Core Launch Public Collection
- **Symbol**: CLPC
- **Max Supply**: 1,000 NFTs
- **Royalty**: 5%
- **Creator**: `0x71197e7a1CA5A2cb2AD82432B924F69B1E3dB123`
- **Minted NFTs**: 1
- **Mint Price**: 0.5 CORE
- **Factory**: Latest Factory (0.1 CORE fee)
- **Explorer**: [View Contract](https://scan.test2.btcs.network/address/0xdE4AfE2a9646299b97e35C0B3C50D04cCb74Bf3a)
- **Royalty**: 15%
- **Creator**: `0x71197e7a1CA5A2cb2AD82432B924F69B1E3dB123`
- **Minted NFTs**: 5
- **Explorer**: [View Contract](https://scan.test2.btcs.network/address/0x06aB3506fe4B2b0EA048d06A4aEE848F83340290)

## 🔑 Deployer Account
- **Address**: `0x71197e7a1CA5A2cb2AD82432B924F69B1E3dB123`
- **Network**: Core Testnet2
- **Role**: Contract deployer, NFT creator, initial owner

## 📊 Contract Statistics
- **Total Collections**: 4
- **Total NFTs Minted**: 14
- **Total Contracts**: 7 (4 NFT Collections + 3 Factories + 1 Marketplace + 1 Bidding)
- **Active Factory**: `0x2823Af7e1F2F50703eD9f81Ac4B23DC1E78B9E53` *(Latest - 0.1 CORE fee)*
- **Previous Factory**: `0x0E90a99b22Cc5b281FF52f418BAe4ec909a7F5fb` *(1 CORE fee)*
- **Deprecated Factory**: `0xAaFE053F1D8402282c839aeb595218F30aa7DCC6` *(Old version)*
- **Total Platform Fees**: 
  - Marketplace: 2.5%
  - Bidding: 1%
- **Collection Creation Fee**: 0.1 CORE *(Latest)*, 1 CORE *(Previous)*
- **Default NFT Mint Price**: 0.5 CORE

## 🛠️ Development Information

### Hardhat Configuration
- **Network**: `core-testnet2`
- **Gas Limit**: Auto
- **Gas Price**: Auto
- **Compiler**: Solidity 0.8.19

### Dependencies
- **OpenZeppelin**: Latest version
- **Hardhat**: Latest version
- **Ethers.js**: v6

### Deployment Scripts
- `scripts/deploy-factory.js` - NFTCollectionFactory deployment
- `scripts/deploy-marketplace.js` - NFTMarketplace deployment
- `scripts/deploy-bidding.js` - NFTBidding deployment
- `scripts/create-sample-collection.js` - Sample collections creation
- `scripts/mint-sample-nft.js` - Sample NFT minting
- `scripts/test-bidding.js` - Bidding system testing

## 🔍 Contract Verification

### Verified Contracts
- ✅ NFTCollectionFactory
- ✅ NFTMarketplace  
- ✅ NFTBidding
- ✅ Sample NFT Collections

### Verification Commands
```bash
# LATEST Factory verification (Active - 0.1 CORE fee)
npx hardhat verify --network core-testnet2 0x2823Af7e1F2F50703eD9f81Ac4B23DC1E78B9E53

# PREVIOUS Factory verification (1 CORE fee)
npx hardhat verify --network core-testnet2 0x0E90a99b22Cc5b281FF52f418BAe4ec909a7F5fb

# OLD Factory verification (Deprecated)
npx hardhat verify --network core-testnet2 0xAaFE053F1D8402282c839aeb595218F30aa7DCC6

# Marketplace verification
npx hardhat verify --network core-testnet2 0x19E88E3790A43721faD03CD5A68A100E18F40c4E

# Bidding verification
npx hardhat verify --network core-testnet2 0x7a9D78D1E5fe688F80D4C2c06Ca4C0407A967644
```

## 📁 File Structure
```
contracts/
├── NFTCollection.sol          # ERC-721 NFT Collection
├── NFTCollectionFactory.sol   # Factory for creating collections
├── NFTMarketplace.sol         # NFT trading marketplace
└── NFTBidding.sol            # NFT bidding system

scripts/
├── deploy-factory.js         # Deploy factory contract
├── deploy-marketplace.js     # Deploy marketplace contract
├── deploy-bidding.js         # Deploy bidding contract
├── create-sample-collection.js # Create sample collections
├── mint-sample-nft.js        # Mint sample NFTs
└── test-bidding.js           # Test bidding functionality
```

## 🚨 Important Notes

### Security
- All contracts use OpenZeppelin libraries
- Protected with ReentrancyGuard
- Access control with Ownable pattern
- Emergency functions available

### Gas Optimization
- Gas limits are optimized
- Batch operations supported
- Efficient storage patterns

### Testing
- All contracts tested
- Bidding system working
- NFT minting working
- Marketplace functions working

## 📞 Support
- **Developer**: Core-Launch Team
- **Repository**: Core-Launch Project
- **Network**: Core Blockchain Testnet2
- **Last Updated**: 2025-01-12 *(Updated with latest factory and new collection)*

---

**⚠️ This documentation is valid for Core Testnet2. Separate documentation is required for Mainnet deployment.**
