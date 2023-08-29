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
    
    const isLocal = process.env.RUNNING_ON_LOCALSTACK || false;
    const queueUrl = isLocal ? 
        `http://${process.env.LOCALSTACK_HOSTNAME}:4566/000000000000/your-service-name-local-TaskQueue-2f45ef2c` : 
        process.env.SQS_QUEUE_URL;

    //const queueUrl = process.env.SQS_QUEUE_URL;
    console.log(`sqs url is ${queueUrl}`);

    // Publish the "SetValueInitiated" event to AWS SQS
    const params = {
        MessageBody: JSON.stringify(taskData),
        QueueUrl: queueUrl  // Replace with your SQS Queue URL
    };

    sqs.sendMessage(params, (err, data) => {
        if (err) {
            return res.status(500).json({ error: `Failed to send message to SQS because ${err}` });
        }
        res.json({ RefrenceId: taskData.taskId });
    });
});

export default router;
