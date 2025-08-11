const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying NFT Bidding contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy NFTBidding
  const NFTBidding = await ethers.getContractFactory("NFTBidding");
  const bidding = await NFTBidding.deploy();
  
  console.log("⏳ Deploying bidding contract...");
  await bidding.waitForDeployment();
  
  const biddingAddress = await bidding.getAddress();
  console.log("✅ NFT Bidding deployed to:", biddingAddress);
  console.log("📊 Platform fee: 1%");
  console.log("⏰ Min bidding duration: 1 hour");
  console.log("🔐 Owner:", deployer.address);

  // Verify deployment
  const code = await ethers.provider.getCode(biddingAddress);
  if (code === "0x") {
    console.log("❌ Contract deployment failed - no code at address");
  } else {
    console.log("✅ Contract deployment verified - code found at address");
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Contract addresses:");
  console.log("   NFTBidding:", biddingAddress);
  console.log("\n🔗 Core Testnet2 Explorer:");
  console.log(`   https://scan.testnet2.coredao.org/address/${biddingAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
