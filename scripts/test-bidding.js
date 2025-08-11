const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing NFT Bidding system...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Testing with account:", deployer.address);

  // NFT Collection and Token ID to test
  const nftContract = "0x5b8564DC0BB802C86787C60479eC8D7EB038Fb93"; // CLTC Collection
  const tokenId = 1; // First NFT
  
  // Bidding contract
  const biddingContract = await ethers.getContractAt("NFTBidding", "0x7a9D78D1E5fe688F80D4C2c06Ca4C0407A967644");
  
  try {
    console.log(`\n🎯 Testing bidding for NFT ${tokenId} in collection ${nftContract}`);
    
    // Check if NFT exists and owner
    const nftContractInstance = await ethers.getContractAt("NFTCollection", nftContract);
    const owner = await nftContractInstance.ownerOf(tokenId);
    console.log("👤 NFT Owner:", owner);
    console.log("🔑 Deployer:", deployer.address);
    
    if (owner !== deployer.address) {
      console.log("❌ Deployer is not the owner of this NFT");
      return;
    }
    
    // Approve bidding contract for all tokens
    console.log("✅ Approving bidding contract for all tokens...");
    const approveTx = await nftContractInstance.setApprovalForAll(biddingContract.target, true);
    await approveTx.wait();
    console.log("✅ Approval successful");
    
    // Start bidding
    console.log("🚀 Starting bidding...");
    const minBid = ethers.parseEther("0.01"); // 0.01 CORE
    const duration = 3600; // 1 hour
    const message = "Test bidding for Core Launch NFT!";
    
    const startBiddingTx = await biddingContract.startBidding(
      nftContract, 
      tokenId, 
      minBid, 
      duration, 
      message
    );
    
    console.log("⏳ Starting bidding transaction sent:", startBiddingTx.hash);
    await startBiddingTx.wait();
    console.log("✅ Bidding started successfully!");
    
    // Get bidding info
    const biddingInfo = await biddingContract.getBiddingInfo(nftContract, tokenId);
    console.log("📊 Bidding Info:");
    console.log("   Owner:", biddingInfo.owner);
    console.log("   Min Bid:", ethers.formatEther(biddingInfo.minBid), "CORE");
    console.log("   Highest Bid:", ethers.formatEther(biddingInfo.highestBid), "CORE");
    console.log("   End Time:", new Date(Number(biddingInfo.endTime) * 1000).toLocaleString());
    console.log("   Is Active:", biddingInfo.isActive);
    console.log("   Total Bids:", biddingInfo.totalBids.toString());
    
    console.log("\n🎉 Bidding test completed successfully!");
    console.log("🔗 Bidding Contract:", biddingContract.target);
    console.log("🔗 NFT Contract:", nftContract);
    console.log("🆔 Token ID:", tokenId);
    
  } catch (error) {
    console.error("❌ Bidding test failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
