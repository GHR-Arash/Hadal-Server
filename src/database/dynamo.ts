console.log("Received a request for aws accoutn generation");
import AWS from 'aws-sdk';

// const client = new AWS.DynamoDB.DocumentClient();
let client;
let options = {};

// Check if we're running against LocalStack
if (process.env.RUNNING_ON_LOCALSTACK) {
  options = {
    region: 'us-east-1',
    endpoint: 'http://172.19.0.2:4566',
    accessKeyId: 'test',  // Dummy credentials for LocalStack
    secretAccessKey: 'test',
    sslEnabled: false
  };
}

try {
   client = new AWS.DynamoDB.DocumentClient(options);
}catch (error) {
  console.error('Error connecting to DynamoDB:', error);
}




export const getWorkspaceById = async (apiAccessKey: string) => {
  const params = {
    TableName: 'Workspaces',
    Key: {
      'apiAccessKey': apiAccessKey  // Assuming apiAccessKey is a variable that holds the key you want to look up
    }
  };
  
  try {
    let result = await client.get(params).promise();
    return result; 
  } catch (error) {
    console.error(`error in db connection ${error}`);
    return null
  }
};


export const createTask = async (taskData: any) => {
  const params = {
    TableName: 'Tasks',
    Item: taskData
  };
  return await client.put(params).promise();
};


export const getTaskByWorkspaceAndExternalId = async (workspaceId: string, externalId: string) => {
    const params = {
        TableName: 'Tasks',
        KeyConditionExpression: 'workspaceId = :wId AND externalId = :eId',
        ExpressionAttributeValues: {
            ':wId': workspaceId,
            ':eId': externalId
        }
    };
    const result = await client.query(params).promise();
    return result.Items[0];
};

// ... other database functions
