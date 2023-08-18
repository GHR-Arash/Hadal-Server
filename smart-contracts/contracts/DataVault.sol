// SPDX-License-Identifier: MIT
// Compiled with Solidity 0.8.19 (or whatever version you used)
pragma solidity ^0.8.0;

contract DataVault {
   
    mapping(string => string) private store;

   
    address public owner;

    // State variable for the contract's version
    string public version;

    // Event to log when a new key-value pair is set
    event ValueSet(string key, string value);

    // Modifier to restrict certain operations to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    
    constructor(string memory _version) {
        owner = msg.sender;
        version = _version;
    }

 
    function setValue(string memory key, string memory value) public onlyOwner {
        store[key] = value;
        emit ValueSet(key, value);
    }

    
    function getValue(string memory key) public onlyOwner view returns (string memory) {
        return store[key];
    }

   
    function changeOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }

   
    function updateVersion(string memory _version) public onlyOwner {
        version = _version;
    }
}
