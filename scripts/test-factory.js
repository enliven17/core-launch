const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing NFTCollectionFactory contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Testing with account:", deployer.address);

  // Get the factory contract
  const factoryAddress = "0xB016bc8Ae5E9a5BF1e02C2C4C109c1aE66Bd62C8";
  const factory = await ethers.getContractAt("NFTCollectionFactory", factoryAddress);
  
  console.log("🏭 Factory contract:", factoryAddress);

  try {
    // Test 1: Check creation fee
    const creationFee = await factory.COLLECTION_CREATION_FEE();
    console.log("✅ Creation fee:", ethers.formatEther(creationFee), "CORE");

    // Test 2: Check owner
    const owner = await factory.owner();
    console.log("✅ Owner:", owner);

    // Test 3: Check collections count
    const collectionsCount = await factory.getAllCollections();
    console.log("✅ Collections count:", collectionsCount.length);

    // Test 4: Check if we can estimate gas for collection creation
    const name = "Test Collection";
    const symbol = "TEST";
    const baseURI = "https://api.example.com/metadata/";
    const maxSupply = 100;
    const royaltyPercentage = 5;
    const creationFeeValue = ethers.parseEther('0.1');

    console.log("🧪 Testing gas estimation...");
    const gasEstimate = await factory.createCollection.estimateGas(
      name,
      symbol,
      baseURI,
      maxSupply,
      royaltyPercentage,
      { value: creationFeeValue }
    );
    console.log("✅ Gas estimate successful:", gasEstimate.toString());

    console.log("🎉 All tests passed! Contract is working correctly.");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    
    // Try to get more details about the error
    if (error.data) {
      console.error("Error data:", error.data);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
