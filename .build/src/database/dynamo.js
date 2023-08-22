import AWS from 'aws-sdk';
const client = new AWS.DynamoDB.DocumentClient();
export const getWorkspaceById = async (apiAccessKey) => {
    const params = {
        TableName: 'Workspaces',
        Key: { apiAccessKey }
    };
    return await client.get(params).promise();
};
export const createTask = async (taskData) => {
    const params = {
        TableName: 'Tasks',
        Item: taskData
    };
    return await client.put(params).promise();
};
export const getTaskByWorkspaceAndExternalId = async (workspaceId, externalId) => {
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
//# sourceMappingURL=dynamo.js.map