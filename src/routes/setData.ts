import express,{ Request,Response} from 'express';
import { authenticate } from '../middleware/auth';
import { createTask } from '../database/dynamo';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';

const router = express.Router();
const sqs = new AWS.SQS();

router.post('/', authenticate, async (req:Request, res:Response) => {
    const { encryptedData, externalId } = req.body;
    const workspaceId = req.workspaceId;

    const taskData = {
        taskId:uuidv4(),
        workspaceId,
        externalId,
        name: "SetValue",
        state: "Initiated",
        value: encryptedData,
        time: new Date().toISOString()
    };

    await createTask(taskData);
    
    const queueUrl = process.env.QUEUE_URL;

    // Publish the "SetValueInitiated" event to AWS SQS
    const params = {
        MessageBody: JSON.stringify(taskData),
        QueueUrl: 'YOUR_SQS_QUEUE_URL'  // Replace with your SQS Queue URL
    };

    sqs.sendMessage(params, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to send message to SQS' });
        }
        res.json({ RefrenceId: taskData.taskId });
    });
});

export default router;
