import { DynamoDB } from 'aws-sdk';
import { ethers } from 'ethers';
import { providers } from 'ethers';
import fs from 'fs';
import { SmartContract } from '../entities/SmartContract';
const dynamoDB = new DynamoDB.DocumentClient();
export const processTaskQueue = async (event) => {
    for (const record of event.Records) {
        const body = JSON.parse(record.body);
        const { workspaceId, externalId, metadata } = body;
        const smartContract = await getSmartContractByWorkspaceId(workspaceId);
        if (smartContract) {
            await callSetValueOnSmartContract(smartContract.contractAddress, metadata.key, metadata.value);
        }
        else {
            const deployedContractAddress = await deploySmartContract();
            await storeSmartContractMetadata(workspaceId, deployedContractAddress);
            await callSetValueOnSmartContract(deployedContractAddress, metadata.key, metadata.value);
        }
        await updateTaskStateToDone(workspaceId, externalId);
    }
};
const getSmartContractByWorkspaceId = async (workspaceId) => {
    const params = {
        TableName: 'SmartContractTable',
        Key: {
            workspaceId: workspaceId
        }
    };
    try {
        const result = await dynamoDB.get(params).promise();
        if (result.Item) {
            return new SmartContract(result.Item.workspaceId, new Date(result.Item.deployedTime), result.Item.contractAddress);
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error(`Error retrieving smart contract for workspaceId ${workspaceId}:`, error);
        throw error;
    }
};
const callSetValueOnSmartContract = async (contractAddress, key, value) => {
    const abi = JSON.parse(fs.readFileSync('../../smart-contracts/DataVault.abi', 'utf8'));
    const provider = new providers.JsonRpcProvider('https://mainnet.infura.io/v3/INFURA_PROJECT_ID');
    const privateKey = 'PRIVATE_KEY';
    const wallet = new ethers.Wallet(privateKey);
    const connectedWallet = wallet.connect(provider);
    const contractInstance = new ethers.Contract(contractAddress, abi, connectedWallet);
    const tx = await contractInstance.setValue(key, value);
    const receipt = await tx.wait();
    return receipt;
};
const deploySmartContract = async () => {
    const abi = JSON.parse(fs.readFileSync('../../smart-contracts/DataVault.abi', 'utf8'));
    const bytecode = fs.readFileSync('./smart-contracts/DataVault.bin', 'utf8');
    const provider = new providers.JsonRpcProvider('https://mainnet.infura.io/v3/INFURA_PROJECT_ID');
    const privateKey = 'YOUR_PRIVATE_KEY';
    const wallet = new ethers.Wallet(privateKey);
    const connectedWallet = wallet.connect(provider);
    const contractFactory = new ethers.ContractFactory(abi, bytecode, connectedWallet);
    const contractInstance = await contractFactory.deploy();
    await contractInstance.deployed();
    return contractInstance.address;
};
const storeSmartContractMetadata = async (workspaceId, contractAddress) => {
    const params = {
        TableName: 'SmartContractTable',
        Item: {
            workspaceId: workspaceId,
            contractAddress: contractAddress,
            deployedTime: new Date().toISOString()
        }
    };
    try {
        await dynamoDB.put(params).promise();
        console.log(`Stored smart contract metadata for workspaceId ${workspaceId}.`);
    }
    catch (error) {
        console.error(`Error storing smart contract metadata for workspaceId ${workspaceId}:`, error);
        throw error;
    }
};
const updateTaskStateToDone = async (workspaceId, externalId) => {
    const params = {
        TableName: 'Tasks',
        Key: {
            workspaceId: workspaceId,
            externalId: externalId
        },
        UpdateExpression: 'set #state = :done',
        ExpressionAttributeNames: {
            '#state': 'state'
        },
        ExpressionAttributeValues: {
            ':done': 'Done'
        }
    };
    try {
        await dynamoDB.update(params).promise();
        console.log(`Task with externalId ${externalId} updated to Done.`);
    }
    catch (error) {
        console.error(`Error updating task with externalId ${externalId}:`, error);
    }
};
//# sourceMappingURL=handlers.js.map