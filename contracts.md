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
- **Address**: `0xAaFE053F1D8402282c839aeb595218F30aa7DCC6`
- **Purpose**: Factory contract for creating NFT collections
- **Features**:
  - Collection creation
  - Collection count tracking
  - Collection listing
- **Deployment Date**: 2025-01-11
- **Explorer**: [View Contract](https://scan.test2.btcs.network/address/0xAaFE053F1D8402282c839aeb595218F30aa7DCC6)

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
- **Royalty**: 15%
- **Creator**: `0x71197e7a1CA5A2cb2AD82432B924F69B1E3dB123`
- **Minted NFTs**: 5
- **Explorer**: [View Contract](https://scan.test2.btcs.network/address/0x06aB3506fe4B2b0EA048d06A4aEE848F83340290)

## 🔑 Deployer Account
- **Address**: `0x71197e7a1CA5A2cb2AD82432B924F69B1E3dB123`
- **Network**: Core Testnet2
- **Role**: Contract deployer, NFT creator, initial owner

## 📊 Contract Statistics
- **Total Collections**: 3
- **Total NFTs Minted**: 12
- **Total Contracts**: 5 (3 NFT Collections + 1 Factory + 1 Marketplace + 1 Bidding)
- **Total Platform Fees**: 
  - Marketplace: 2.5%
  - Bidding: 1%

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
# Factory verification
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
- **Last Updated**: 2025-01-11

---

**⚠️ This documentation is valid for Core Testnet2. Separate documentation is required for Mainnet deployment.**
