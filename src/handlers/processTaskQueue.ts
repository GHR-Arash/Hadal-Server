import { SQSEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { ethers } from 'ethers';
import { providers } from 'ethers';
import fs from 'fs';
import { SmartContract } from '../entities/SmartContract';



const dynamoDB = new DynamoDB.DocumentClient();

export const processTaskQueue = async (event: SQSEvent) => {
    for (const record of event.Records) {
        const body = JSON.parse(record.body);
        const { workspaceId, externalId, metadata } = body;

        // Check if workspaceId has an associated smart contract
        const smartContract = await getSmartContractByWorkspaceId(workspaceId);

        if (smartContract) {
            // Call the smart contract's setValue function
            await callSetValueOnSmartContract(smartContract.contractAddress, metadata.key,metadata.value);
        } else {
            // Deploy a new smart contract
            const deployedContractAddress = await deploySmartContract();

            // Store the smart contract's metadata in the database
            await storeSmartContractMetadata(workspaceId, deployedContractAddress);

            // Call the smart contract's setValue function
            await callSetValueOnSmartContract(deployedContractAddress, metadata.key,metadata.value);
        }

        // Update the task state to "Done" in DynamoDB
        await updateTaskStateToDone(workspaceId, externalId);
    }
};




const getSmartContractByWorkspaceId = async (workspaceId: string): Promise<SmartContract | null> => {
    const params: DynamoDB.DocumentClient.GetItemInput = {
        TableName: 'SmartContractTable',
        Key: {
            workspaceId: workspaceId
        }
    };

    try {
        const result = await dynamoDB.get(params).promise();
        if (result.Item) {
            return new SmartContract(
                result.Item.workspaceId as string,
                new Date(result.Item.deployedTime as string),
                result.Item.contractAddress as string
            );
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error retrieving smart contract for workspaceId ${workspaceId}:`, error);
        throw error;
    }
};




const callSetValueOnSmartContract = async (contractAddress: string, key: string, value: string) => {
    // Load the ABI of the compiled smart contract from disk
    const abi = JSON.parse(fs.readFileSync('../../smart-contracts/DataVault.abi', 'utf8'));

    // Set up a provider using Infura
    const provider = new providers.JsonRpcProvider('https://mainnet.infura.io/v3/INFURA_PROJECT_ID');

    const privateKey = 'PRIVATE_KEY';
    const wallet = new ethers.Wallet(privateKey);

    const connectedWallet = wallet.connect(provider);


    const contractInstance = new ethers.Contract(contractAddress, abi, connectedWallet);

    // Call the setValue function on the contract instance
    const tx = await contractInstance.setValue(key, value);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    return receipt;
};



const deploySmartContract = async ():Promise<string>=> {
    
    const abi = JSON.parse(fs.readFileSync('../../smart-contracts/DataVault.abi', 'utf8'));
    const bytecode = fs.readFileSync('./smart-contracts/DataVault.bin', 'utf8');

    // Set up a provider using Infura
    const provider = new providers.JsonRpcProvider('https://mainnet.infura.io/v3/INFURA_PROJECT_ID');

   
    const privateKey = 'YOUR_PRIVATE_KEY';
    const wallet = new ethers.Wallet(privateKey);
 
    const connectedWallet = wallet.connect(provider);

    const contractFactory = new ethers.ContractFactory(abi, bytecode, connectedWallet);
    const contractInstance = await contractFactory.deploy();

    // Wait for the contract to be mined
    await contractInstance.deployed();

    return contractInstance.address;

};



const storeSmartContractMetadata = async (workspaceId: string, contractAddress: string) => {
    const params = {
        TableName: 'SmartContractTable', // Name of your DynamoDB table
        Item: {
            workspaceId: workspaceId,
            contractAddress: contractAddress,
            deployedTime: new Date().toISOString() // Storing the current time as the deployment time in ISO format
        }
    };

    try {
        await dynamoDB.put(params).promise();
        console.log(`Stored smart contract metadata for workspaceId ${workspaceId}.`);
    } catch (error) {
        console.error(`Error storing smart contract metadata for workspaceId ${workspaceId}:`, error);
        throw error; // or handle the error as needed
    }
};


const updateTaskStateToDone = async (workspaceId: string, externalId: string) => {
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
    } catch (error) {
        console.error(`Error updating task with externalId ${externalId}:`, error);
    }
};
