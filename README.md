# Core-Launch 🚀

A decentralized NFT launchpad platform on Core Blockchain where you can create NFT collections, list them for sale, and receive bids.

## 🌟 Features

- **NFT Collection Creation**: Create your own NFT collections
- **NFT Minting**: Add NFTs to your collections
- **Marketplace**: List your NFTs for sale
- **Bidding System**: Receive bids for your NFTs
- **Bid History**: View all bids on the blockchain
- **Real-time Updates**: Live blockchain data
- **Core Blockchain**: Works on Core Testnet2

## 🚀 Deployed Contracts

### Core Contracts
- **NFTCollectionFactory**: `0xAaFE053F1D8402282c839aeb595218F30aa7DCC6`
- **NFTMarketplace**: `0x19E88E3790A43721faD03CD5A68A100E18F40c4E`
- **NFTBidding**: `0x7a9D78D1E5fe688F80D4C2c06Ca4C0407A967644`

### Sample Collections
- **CLTC Collection**: `0x5b8564DC0BB802C86787C60479eC8D7EB038Fb93`
- **DAM Collection**: `0x38DC4a41C05AdB41C923c6d912947817E0932957`
- **GL Collection**: `0x06aB3506fe4B2b0EA048d06A4aEE848F83340290`

📋 **For detailed contract information**: [contracts.md](./contracts.md)

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Blockchain**: Core Blockchain Testnet2
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **Wallet Integration**: MetaMask, WalletConnect
- **Styling**: Styled Components, Tailwind CSS

## 🚀 Installation

### Requirements
- Node.js 18+
- npm or yarn
- MetaMask wallet
- Core Testnet2 network

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/your-username/core-launch.git
cd core-launch
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit the .env file
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

## 📱 Usage

### 1. Create Collection
- Go to `/create/collection` page
- Set collection name, symbol, max supply and royalty
- Confirm with your wallet

### 2. Mint NFTs
- Go to collection detail page
- Click "Mint NFT" button
- Add token URI and metadata

### 3. Start Bidding
- As NFT owner, start bidding
- Set minimum bid and duration
- Track bids

### 4. Place Bids
- Bid on active biddings
- Add amount and message
- Confirm with your wallet

## 🔗 Network Information

- **Network**: Core Blockchain Testnet2
- **Chain ID**: 1114
- **RPC URL**: https://rpc.test2.btcs.network
- **Explorer**: https://scan.test2.btcs.network
- **Currency**: CORE

## 📊 Test Results

- ✅ NFT Collection Factory deployed
- ✅ 3 sample collections created
- ✅ 12 NFTs minted
- ✅ Marketplace contract deployed
- ✅ Bidding system working
- ✅ Frontend integration complete

## 🧪 Testing

### Smart Contract Tests
```bash
npx hardhat test
```

### Bidding System Test
```bash
npx hardhat run scripts/test-bidding.js --network core-testnet2
```

### NFT Minting Test
```bash
npx hardhat run scripts/mint-sample-nft.js --network core-testnet2
```

## 📁 Project Structure

```
core-launch/
├── contracts/                 # Smart contracts
│   ├── NFTCollection.sol     # ERC-721 NFT Collection
│   ├── NFTCollectionFactory.sol # Factory contract
│   ├── NFTMarketplace.sol    # Marketplace contract
│   └── NFTBidding.sol        # Bidding system
├── scripts/                   # Deployment scripts
├── src/                       # Frontend source code
│   ├── app/                  # Next.js app router
│   ├── components/           # React components
│   ├── lib/                  # Utilities and contracts
│   └── contexts/             # React contexts
├── contracts.md              # Contract documentation
└── README.md                 # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Project Link**: [https://github.com/your-username/core-launch](https://github.com/your-username/core-launch)
- **Core Blockchain**: [https://coredao.org](https://coredao.org)
- **Documentation**: [https://docs.coredao.org](https://docs.coredao.org)

## 🙏 Acknowledgments

- [Core Blockchain](https://coredao.org) - Blockchain infrastructure
- [OpenZeppelin](https://openzeppelin.com) - Smart contract libraries
- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - CSS framework

---

**⭐ Don't forget to star this project if you like it!**
