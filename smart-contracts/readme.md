
```markdown
# DataVault Smart Contract

This repository contains the `DataVault` smart contract and its associated unit tests. The contract is written in Solidity and the tests use the Truffle framework.

## Prerequisites

1. **Node.js and npm**: Ensure you have Node.js and npm installed. You can check by running:
   ```bash
   node -v
   npm -v
   ```

2. **Truffle**: Install Truffle globally:
   ```bash
   npm install -g truffle
   ```

3. **Ganache (Optional)**: For local testing, you can use Ganache as your personal blockchain. You can download it from [here](https://www.trufflesuite.com/ganache).

## Setup



1. **Install Required Packages**:
   ```bash
   npm install @truffle/hdwallet-provider chai
   ```

2. **Configure Truffle**:
   - Update the `truffle-config.js` file with the Polygon network configuration.

3. **Compile the Contract**:
   ```bash
   truffle compile
   ```

## Testing

1. **Run Tests Locally** (Optional):
   - If you have Ganache running, you can test the contract locally:
     ```bash
     npm install -g ganache-cli
     ganache-cli
     truffle test
     ```

2. **Run Tests on Polygon** (Optional):
   - If you want to run tests on the Polygon network (this will cost gas):
     ```bash
     truffle test --network polygon
     ```

## Deployment

- **Deploy to Polygon**:
   - Ensure you have set up the `truffle-config.js` with the correct Infura key and mnemonic.
   - Deploy the contract to the Polygon network:
     ```bash
     truffle migrate --network polygon
     ```
- **Deploy to Local(Ganache)**:
   - Deploy the contract to the Polygon Ganache:
     ```bash
     truffle migrate --network development
     `
## Important Notes
  
- **Gas Costs**: Running tests or deploying contracts on public networks (like Polygon) will cost gas. Ensure you have enough MATIC in your wallet.


```

