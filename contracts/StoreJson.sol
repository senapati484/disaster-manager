// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StoreJson {
    struct Response {
        string jsonData;
        uint256 timestamp;
        uint256 cycleId;
    }

    uint256 public currentCycleId;
    uint256 public responsesPerCycle;
    uint256 public currentResponseCount;
    mapping(uint256 => Response[]) public responseCycles;
    
    event JsonStored(string json, uint256 cycleId, uint256 timestamp);
    event NewCycleStarted(uint256 cycleId);

    constructor(uint256 _responsesPerCycle) {
        require(_responsesPerCycle > 0, "Responses per cycle must be greater than 0");
        responsesPerCycle = _responsesPerCycle;
        currentCycleId = 1;
        currentResponseCount = 0;
    }

    function storeJson(string memory _json) public {
        uint256 timestamp = block.timestamp;
        
        if (currentResponseCount >= responsesPerCycle) {
            currentCycleId++;
            currentResponseCount = 0;
            emit NewCycleStarted(currentCycleId);
        }

        responseCycles[currentCycleId].push(Response({
            jsonData: _json,
            timestamp: timestamp,
            cycleId: currentCycleId
        }));

        currentResponseCount++;
        emit JsonStored(_json, currentCycleId, timestamp);
    }

    function getResponsesInCycle(uint256 cycleId) public view returns (Response[] memory) {
        return responseCycles[cycleId];
    }

    function getCurrentCycleResponses() public view returns (Response[] memory) {
        return responseCycles[currentCycleId];
    }
}