const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying NFT Marketplace contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy NFTMarketplace
  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
  const marketplace = await NFTMarketplace.deploy();
  
  console.log("⏳ Deploying marketplace...");
  await marketplace.waitForDeployment();
  
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ NFT Marketplace deployed to:", marketplaceAddress);
  console.log("📊 Platform fee: 2.5%");
  console.log("🔐 Owner:", deployer.address);

  // Verify deployment
  const code = await ethers.provider.getCode(marketplaceAddress);
  if (code === "0x") {
    console.log("❌ Contract deployment failed - no code at address");
  } else {
    console.log("✅ Contract deployment verified - code found at address");
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Contract addresses:");
  console.log("   NFTMarketplace:", marketplaceAddress);
  console.log("\n🔗 Core Testnet2 Explorer:");
  console.log(`   https://scan.testnet2.coredao.org/address/${marketplaceAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
