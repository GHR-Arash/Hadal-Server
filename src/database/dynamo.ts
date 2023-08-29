import AWS from 'aws-sdk';

// const client = new AWS.DynamoDB.DocumentClient();
let client;
let options = {};
console.log(`localstack host name :${process.env.RUNNING_ON_LOCALSTACK}`)

// Check if we're running against LocalStack
if (process.env.RUNNING_ON_LOCALSTACK) {
  options = {
    region: 'us-east-1',
    endpoint: `${process.env.LOCALSTACK_HOSTNAME}:4566`,
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
    if (Object.keys(result).length === 0) {
      return null;
    }
    return result; 
  } catch (error) {
    console.error(`error in db connection ${error}`);
    return null
  }
};



export const createTask = async (taskData: any): Promise<any> => {
  console.log('create task function')
  try {
    const params = {
      TableName: 'Tasks',
      Item: taskData
    };
      await client.put(params).promise();
  } catch (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }
};


export const getTaskByWorkspaceAndExternalId = async (taskId: string, externalId: string,workspaceId) => {
  const params = {
    TableName: 'Tasks',
    KeyConditionExpression: 'taskId = :tId AND externalId = :eId',
    ExpressionAttributeValues: {
        ':tId': taskId,
        ':eId': externalId
    }
};
    console.log('running query')
    const result = await client.query(params).promise();
    if(result.Items[0] && result.Items[0].workspaceId==workspaceId)
    return result.Items[0];
    else return null
};

// ... other database functions
