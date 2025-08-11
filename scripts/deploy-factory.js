const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying NFTCollectionFactory to Core Blockchain Testnet2...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy NFTCollectionFactory
  const NFTCollectionFactory = await ethers.getContractFactory("NFTCollectionFactory");
  const factory = await NFTCollectionFactory.deploy();
  
  await factory.waitForDeployment();
  
  const factoryAddress = await factory.getAddress();
  console.log("✅ NFTCollectionFactory deployed to:", factoryAddress);
  console.log("🔗 Contract address:", factoryAddress);
  
  // Verify deployment
  const creationFee = await factory.COLLECTION_CREATION_FEE();
  console.log("💸 Collection creation fee:", ethers.formatEther(creationFee), "CORE");
  
  console.log("🎉 Deployment completed successfully!");
  console.log("📋 Next steps:");
  console.log("   1. Update frontend with factory address:", factory.address);
  console.log("   2. Test collection creation");
  console.log("   3. Verify on Core Blockchain Testnet2 explorer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
