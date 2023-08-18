// SPDX-License-Identifier: MIT
// Compiled with Solidity 0.8.19 (or whatever version you used)
pragma solidity ^0.8.0;

contract DataVault {
    // State variable to store key-value pairs
    mapping(string => string) private store;

    // State variable for the contract's owner
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

    // Constructor to set the contract's owner and version upon deployment
    constructor(string memory _version) {
        owner = msg.sender;
        version = _version;
    }

    // Function to set a key-value pair
    function setValue(string memory key, string memory value) public onlyOwner {
        store[key] = value;
        emit ValueSet(key, value);
    }

    // Function to get the value for a given key
    function getValue(string memory key) public onlyOwner view returns (string memory) {
        return store[key];
    }

    // Function to change the contract's owner
    function changeOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    // Function to update the contract's version (optional, based on your needs)
    function updateVersion(string memory _version) public onlyOwner {
        version = _version;
    }
}
