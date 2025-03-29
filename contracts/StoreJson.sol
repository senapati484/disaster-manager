// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StoreJson {
    string public jsonData;
    event JsonStored(string json);

    function storeJson(string memory _json) public {
        jsonData = _json;
        emit JsonStored(_json);
    }

    function getJson() public view returns (string memory) {
        return jsonData;
    }
}