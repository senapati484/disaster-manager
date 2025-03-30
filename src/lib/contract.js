import { ethers } from "ethers";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const abi = [
  "function storeJson(string memory _json) public",
  "function getResponsesInCycle(uint256 cycleId) public view returns (tuple(string jsonData, uint256 timestamp, uint256 cycleId)[] memory)",
  "function getCurrentCycleResponses() public view returns (tuple(string jsonData, uint256 timestamp, uint256 cycleId)[] memory)",
  "function currentCycleId() public view returns (uint256)",
  "function currentResponseCount() public view returns (uint256)",
  "event JsonStored(string json, uint256 cycleId, uint256 timestamp)",
  "event NewCycleStarted(uint256 cycleId)",
];

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);

export const storeJson = async (jsonData) => {
  try {
    const jsonString = JSON.stringify(jsonData);
    const tx = await contract.storeJson(jsonString);
    const receipt = await tx.wait();

    // Get event data
    const event = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .find((event) => event && event.name === "JsonStored");

    const result = {
      jsonData: jsonString,
      cycleId: event.args[1].toString(),
      timestamp: event.args[2].toString(),
    };

    console.log("✅ JSON stored on-chain:", result);
    return result;
  } catch (error) {
    console.error("❌ Error storing JSON:", error.message);
    throw error;
  }
};

export const getCurrentCycleResponses = async () => {
  try {
    const responses = await contract.getCurrentCycleResponses();
    const formattedResponses = responses.map((response) => ({
      jsonData: JSON.parse(response.jsonData),
      timestamp: response.timestamp.toString(),
      cycleId: response.cycleId.toString(),
    }));
    console.log("✅ Retrieved current cycle responses:", formattedResponses);
    return formattedResponses;
  } catch (error) {
    console.error(
      "❌ Error retrieving current cycle responses:",
      error.message
    );
    throw error;
  }
};

export const getResponsesInCycle = async (cycleId) => {
  try {
    const responses = await contract.getResponsesInCycle(cycleId);
    const formattedResponses = responses.map((response) => ({
      jsonData: JSON.parse(response.jsonData),
      timestamp: response.timestamp.toString(),
      cycleId: response.cycleId.toString(),
    }));
    console.log(
      `✅ Retrieved responses for cycle ${cycleId}:`,
      formattedResponses
    );
    return formattedResponses;
  } catch (error) {
    console.error(
      `❌ Error retrieving responses for cycle ${cycleId}:`,
      error.message
    );
    throw error;
  }
};

export const getCurrentCycleInfo = async () => {
  try {
    const currentCycleId = await contract.currentCycleId();
    const currentResponseCount = await contract.currentResponseCount();
    return {
      currentCycleId: currentCycleId.toString(),
      currentResponseCount: currentResponseCount.toString(),
    };
  } catch (error) {
    console.error("❌ Error retrieving cycle info:", error.message);
    throw error;
  }
};
