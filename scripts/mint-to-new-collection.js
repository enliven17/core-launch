const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Minting NFT to new collection in updated factory...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Minting with account:", deployer.address);
  console.log("💰 Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // New collection address from updated factory
  const collectionAddress = "0xdE4AfE2a9646299b97e35C0B3C50D04cCb74Bf3a";
  const collectionName = "Core Launch Public Collection";
  const collectionSymbol = "CLPC";

  try {
    console.log(`\n🎨 Minting NFT to ${collectionName} (${collectionSymbol})...`);
    console.log("📍 Collection address:", collectionAddress);
    
    // Get the collection contract
    const collectionContract = await ethers.getContractAt("NFTCollection", collectionAddress);
    
    // Check if public minting is enabled
    const publicMintingEnabled = await collectionContract.publicMintingEnabled();
    const mintPrice = await collectionContract.mintPrice();
    
    console.log("🔓 Public minting enabled:", publicMintingEnabled);
    console.log("💰 Mint price:", ethers.formatEther(mintPrice), "CORE");
    
    if (!publicMintingEnabled) {
      console.log("❌ Public minting is disabled. Using owner mint instead...");
      
      // Owner mint (free)
      const tokenURI = `https://api.example.com/metadata/${collectionSymbol.toLowerCase()}/1.json`;
      console.log("📋 Token URI:", tokenURI);
      
      const tx = await collectionContract.mint(deployer.address, tokenURI);
      console.log("⏳ Transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("✅ NFT minted successfully!");
      console.log("📊 Gas used:", receipt.gasUsed.toString());
      
    } else {
      console.log("✅ Public minting is enabled. Using public mint...");
      
      // Public mint (0.5 CORE)
      const tokenURI = `https://api.example.com/metadata/${collectionSymbol.toLowerCase()}/1.json`;
      console.log("📋 Token URI:", tokenURI);
      
      const tx = await collectionContract.publicMint(deployer.address, tokenURI, { value: mintPrice });
      console.log("⏳ Transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("✅ NFT minted successfully!");
      console.log("📊 Gas used:", receipt.gasUsed.toString());
    }
    
    // Get token count
    const totalSupply = await collectionContract.totalSupply();
    console.log("📈 Total supply:", totalSupply.toString());
    
  } catch (error) {
    console.error(`❌ Error minting to ${collectionName}:`, error.message);
  }

  console.log("\n🎉 NFT minting completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
