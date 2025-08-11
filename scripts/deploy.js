const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Core-Launch contract deployment...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy NFTCollectionFactory first
  console.log("\n🏭 Deploying NFTCollectionFactory...");
  const NFTCollectionFactory = await ethers.getContractFactory("NFTCollectionFactory");
  const factory = await NFTCollectionFactory.deploy();
  await factory.waitForDeployment();
  
  const factoryAddress = await factory.getAddress();
  console.log("✅ NFTCollectionFactory deployed to:", factoryAddress);
  
  // Get deployment transaction
  const deploymentTx = factory.deploymentTransaction();
  if (deploymentTx) {
    console.log("🔗 Transaction hash:", deploymentTx.hash);
  }

  // Note: NFTMarketplace deployment removed for now
  // Will be implemented in future versions

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  
  // Check factory contract
  const factoryInfo = await factory.getCollectionsCount();
  console.log("📊 Factory collections count:", factoryInfo.toString());
  
  // Check factory owner
  const factoryOwner = await factory.owner();
  console.log("👑 Factory owner:", factoryOwner);
  
  // Check creation fee
  const creationFee = await factory.COLLECTION_CREATION_FEE();
  console.log("💸 Collection creation fee:", ethers.formatEther(creationFee), "CORE");

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("   NFTCollectionFactory:", factoryAddress);
  
  console.log("\n🔗 CoreScan Testnet2 Explorer:");
  console.log("   Factory:", `https://scan.testnet2.coredao.org/address/${factoryAddress}`);
  
  console.log("\n📝 Next steps:");
  console.log("   1. Update environment variables with contract addresses");
  console.log("   2. Verify contracts on CoreScan");
  console.log("   3. Test collection creation through the frontend");
  console.log("   4. Test NFT minting functionality");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
