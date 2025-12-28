const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Get account balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
  
  // Deploy the VotingContract
  console.log("📦 Deploying VotingContract...");
  const VotingContract = await ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy();
  
  await votingContract.waitForDeployment();
  const contractAddress = await votingContract.getAddress();
  
  console.log("✅ VotingContract deployed successfully!");
  console.log("📍 Contract address:", contractAddress);
  console.log("👤 Owner address:", deployer.address);
  
  // Verify deployment
  console.log("🔍 Verifying deployment...");
  const owner = await votingContract.owner();
  const candidateCount = await votingContract.candidateCount();
  const voterCount = await votingContract.voterCount();
  
  console.log("✅ Verification complete:");
  console.log("   - Owner:", owner);
  console.log("   - Initial candidate count:", candidateCount.toString());
  console.log("   - Initial voter count:", voterCount.toString());
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    ownerAddress: deployer.address,
    network: "localhost",
    deployedAt: new Date().toISOString(),
    blockNumber: await deployer.provider.getBlockNumber()
  };
  
  console.log("\n📋 Deployment Summary:");
  console.log("=".repeat(50));
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Owner Address: ${deployer.address}`);
  console.log(`Network: localhost (Hardhat)`);
  console.log(`Block Number: ${deploymentInfo.blockNumber}`);
  console.log("=".repeat(50));
  
  console.log("\n🔧 Next steps:");
  console.log("1. Update context/constants.js with the contract address");
  console.log("2. Start your frontend with: npm run dev");
  console.log("3. Connect MetaMask to localhost:8545");
  console.log("4. Import one of the Hardhat accounts to MetaMask");
  
  return contractAddress;
}

main()
  .then((contractAddress) => {
    console.log(`\n🎉 Deployment completed successfully!`);
    console.log(`📍 Contract deployed at: ${contractAddress}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });