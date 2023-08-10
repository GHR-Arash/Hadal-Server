import express,{ Request,Response} from 'express';
import { authenticate } from '../middleware/auth';
import { createTask } from '../database/dynamo';
import AWS from 'aws-sdk';

const router = express.Router();
const sqs = new AWS.SQS();

router.post('/setData', authenticate, async (req:Request, res:Response) => {
    const { encryptedData, externalId } = req.body;
    const workspaceId = req.workspaceId;

    const taskData = {
        workspaceId,
        externalId,
        Name: "SetValue",
        State: "Initiated",
        Value: encryptedData,
        time: new Date().toISOString()
    };

    await createTask(taskData);

    // Publish the "SetValueInitiated" event to AWS SQS
    const params = {
        MessageBody: JSON.stringify(taskData),
        QueueUrl: 'YOUR_SQS_QUEUE_URL'  // Replace with your SQS Queue URL
    };

    sqs.sendMessage(params, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to send message to SQS' });
        }
        res.json({ RefrenceId: data.MessageId });
    });
});

export default router;
