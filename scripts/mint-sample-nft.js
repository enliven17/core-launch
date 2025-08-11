const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Minting sample NFTs to test collections...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Minting with account:", deployer.address);
  console.log("💰 Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Collection addresses
  const collections = [
    {
      address: "0x5b8564DC0BB802C86787C60479eC8D7EB038Fb93",
      name: "Core Launch Test Collection",
      symbol: "CLTC"
    },
    {
      address: "0x38DC4a41C05AdB41C923c6d912947817E0932957", 
      name: "Digital Art Masters",
      symbol: "DAM"
    },
    {
      address: "0x06aB3506fe4B2b0EA048d06A4aEE848F83340290",
      name: "Gaming Legends", 
      symbol: "GL"
    }
  ];

  for (const collection of collections) {
    try {
      console.log(`\n🎨 Minting NFT to ${collection.name} (${collection.symbol})...`);
      
      // Get the collection contract
      const collectionContract = await ethers.getContractAt("NFTCollection", collection.address);
      
      // Mint NFT
      const tokenURI = `https://api.example.com/metadata/${collection.symbol.toLowerCase()}/1.json`;
      
      console.log("📋 Token URI:", tokenURI);
      
      const tx = await collectionContract.mint(deployer.address, tokenURI);
      console.log("⏳ Transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("✅ NFT minted successfully!");
      console.log("📊 Gas used:", receipt.gasUsed.toString());
      
      // Get token count
      const totalSupply = await collectionContract.totalSupply();
      console.log("📈 Total supply:", totalSupply.toString());
      
    } catch (error) {
      console.error(`❌ Error minting to ${collection.name}:`, error.message);
    }
  }

  console.log("\n🎉 NFT minting completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
