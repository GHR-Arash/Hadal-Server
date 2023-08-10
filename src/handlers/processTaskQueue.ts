import { SQSEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export const processTaskQueue = async (event: SQSEvent) => {
    for (const record of event.Records) {
        const body = JSON.parse(record.body);

        // Extract necessary data from the SQS message
        const { workspaceId, externalId, metadata } = body;

        // Call the external service (e.g., Ethereum JSON RPC)
        // This is a placeholder; replace with actual service call
        const externalServiceResponse = await callExternalService(metadata);

        if (externalServiceResponse.success) {
            // Update the task state to "Completed" in DynamoDB
            const params = {
                TableName: 'Tasks',
                Key: {
                    workspaceId: workspaceId,
                    externalId: externalId
                },
                UpdateExpression: 'set #state = :completed',
                ExpressionAttributeNames: {
                    '#state': 'state'
                },
                ExpressionAttributeValues: {
                    ':completed': 'Completed'
                }
            };

            try {
                await dynamoDB.update(params).promise();
                console.log(`Task with externalId ${externalId} updated to Completed.`);
            } catch (error) {
                console.error(`Error updating task with externalId ${externalId}:`, error);
            }
        } else {
            console.error(`Error calling external service for task with externalId ${externalId}:`,externalServiceResponse);
        }
    }
};

// Placeholder function for the external service call
// Replace with actual implementation
const callExternalService = async (metadata: any) => {
    // Simulate an external service call
    const x = metadata
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
        success: true
    };
};
