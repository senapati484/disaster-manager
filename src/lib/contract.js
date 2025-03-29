import { ethers } from "ethers";

const contractAddress = "YOUR_CONTRACT_ADDRESS"; // After deployment
const abi = [
  "function storeJson(string memory _json) public",
  "function getJson() public view returns (string memory)",
];

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);

export const storeJson = async (jsonData) => {
  try {
    const jsonString = JSON.stringify(jsonData);
    const tx = await contract.storeJson(jsonString);
    await tx.wait();
    console.log("✅ JSON stored on-chain:", jsonString);
    return jsonString;
  } catch (error) {
    console.error("❌ Error storing JSON:", error.message);
    throw error;
  }
};

export const getJson = async () => {
  try {
    const data = await contract.getJson();
    console.log("✅ Retrieved JSON:", data);
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Error retrieving JSON:", error.message);
    throw error;
  }
};
