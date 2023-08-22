import express from 'express';
import { authenticate } from '../middleware/auth';
import { createTask } from '../database/dynamo';
import AWS from 'aws-sdk';
const router = express.Router();
const sqs = new AWS.SQS();
router.post('/', authenticate, async (req, res) => {
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
    const params = {
        MessageBody: JSON.stringify(taskData),
        QueueUrl: 'YOUR_SQS_QUEUE_URL'
    };
    sqs.sendMessage(params, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to send message to SQS' });
        }
        res.json({ RefrenceId: data.MessageId });
    });
});
export default router;
//# sourceMappingURL=setData.js.map