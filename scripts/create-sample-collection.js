const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Creating sample NFT collection on Core Blockchain Testnet2...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Creating collection with account:", deployer.address);
  console.log("💰 Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Get the factory contract
  const factoryAddress = "0x2823Af7e1F2F50703eD9f81Ac4B23DC1E78B9E53";
  const factory = await ethers.getContractAt("NFTCollectionFactory", factoryAddress);
  
  console.log("🏭 Factory contract:", factoryAddress);

  // Collection parameters
  const name = "Core Launch Public Collection";
  const symbol = "CLPC";
  const baseURI = "https://api.example.com/metadata/"; // Placeholder URI
  const maxSupply = 1000; // Maximum 1000 NFTs
  const royaltyPercentage = 5; // 5% royalty

  console.log("📋 Collection details:");
  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Max Supply:", maxSupply);
  console.log("   Royalty:", royaltyPercentage + "%");

  try {
    // Create collection
    const creationFee = ethers.parseEther('0.1'); // 0.1 CORE (temporary for testing)
    
    console.log("💸 Creation fee:", ethers.formatEther(creationFee), "CORE");
    
    const tx = await factory.createCollection(
      name,
      symbol,
      baseURI,
      maxSupply,
      royaltyPercentage,
      { value: creationFee }
    );
    
    console.log("⏳ Transaction sent:", tx.hash);
    console.log("⏳ Waiting for confirmation...");
    
    const receipt = await tx.wait();
    
    // Find CollectionCreated event
    const event = receipt.logs.find((log) => {
      try {
        const parsed = factory.interface.parseLog(log);
        return parsed?.name === 'CollectionCreated';
      } catch {
        return false;
      }
    });
    
    if (event) {
      const parsed = factory.interface.parseLog(event);
      const collectionAddress = parsed?.args[0];
      
      console.log("✅ Collection created successfully!");
      console.log("🔗 Collection address:", collectionAddress);
      console.log("📝 Transaction hash:", tx.hash);
      console.log("📊 Gas used:", receipt.gasUsed.toString());
      
      // Verify on explorer
      console.log("🔍 View on explorer: https://scan.testnet2.coredao.org/address/" + collectionAddress);
    } else {
      console.log("⚠️ Collection created but event not found");
      console.log("📝 Transaction hash:", tx.hash);
    }
    
  } catch (error) {
    console.error("❌ Error creating collection:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
