import AWS from 'aws-sdk';

//const client = new AWS.DynamoDB.DocumentClient();
let options = {};

// Check if we're running against LocalStack
if (process.env.RUNNING_ON_LOCALSTACK) {
  options = {
    region: 'us-east-1',
    endpoint: 'http://localhost:4566',
    accessKeyId: 'test',  // Dummy credentials for LocalStack
    secretAccessKey: 'test',
    sslEnabled: false
  };
}

const client = new AWS.DynamoDB.DocumentClient(options);


export const getWorkspaceById = async (apiAccessKey: string) => {
  const params = {
    TableName: 'Workspaces',
    Key: { apiAccessKey }
  };
  return await client.get(params).promise();
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
