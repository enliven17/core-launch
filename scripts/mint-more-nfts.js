const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Minting more NFTs to show variety...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Minting with account:", deployer.address);

  // Collection addresses
  const collections = [
    {
      address: "0x5b8564DC0BB802C86787C60479eC8D7EB038Fb93",
      name: "Core Launch Test Collection",
      symbol: "CLTC",
      count: 3
    },
    {
      address: "0x38DC4a41C05AdB41C923c6d912947817E0932957", 
      name: "Digital Art Masters",
      symbol: "DAM",
      count: 2
    },
    {
      address: "0x06aB3506fe4B2b0EA048d06A4aEE848F83340290",
      name: "Gaming Legends", 
      symbol: "GL",
      count: 4
    }
  ];

  for (const collection of collections) {
    try {
      console.log(`\n🎨 Minting ${collection.count} more NFTs to ${collection.name} (${collection.symbol})...`);
      
      // Get the collection contract
      const collectionContract = await ethers.getContractAt("NFTCollection", collection.address);
      
      // Get current supply
      const currentSupply = await collectionContract.totalSupply();
      console.log("📊 Current supply:", currentSupply.toString());
      
      // Mint additional NFTs
      for (let i = 1; i <= collection.count; i++) {
        const tokenId = Number(currentSupply) + i;
        const tokenURI = `https://api.example.com/metadata/${collection.symbol.toLowerCase()}/${tokenId}.json`;
        
        console.log(`  📋 Minting NFT #${tokenId} with URI: ${tokenURI}`);
        
        const tx = await collectionContract.mint(deployer.address, tokenURI);
        console.log(`  ⏳ Transaction sent: ${tx.hash}`);
        
        const receipt = await tx.wait();
        console.log(`  ✅ NFT #${tokenId} minted successfully!`);
      }
      
      // Get final supply
      const finalSupply = await collectionContract.totalSupply();
      console.log(`📈 Final supply: ${finalSupply.toString()}`);
      
    } catch (error) {
      console.error(`❌ Error minting to ${collection.name}:`, error.message);
    }
  }

  console.log("\n🎉 Additional NFT minting completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
