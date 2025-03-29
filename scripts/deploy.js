const hre = require("hardhat");

async function main() {
  const StoreJson = await hre.ethers.getContractFactory("StoreJson");
  const storeJson = await StoreJson.deploy();
  await storeJson.deployed();
  console.log(`✅ Contract deployed to: ${storeJson.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
