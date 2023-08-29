import express,{ Request,Response} from 'express';
import { authenticate } from '../middleware/auth';
import { getTaskByWorkspaceAndExternalId } from '../database/dynamo';

const router = express.Router();

router.get('/', authenticate, async (req:Request, res:Response) => {
    const { externalId, taskId } = req.query;
    const workspaceId = req.workspaceId;

    console.log(`externalId:${externalId}`);
    console.log(`workspaceId:${workspaceId}`);

    const task = await getTaskByWorkspaceAndExternalId(taskId as string , externalId as string,workspaceId);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    if (task.State === "Completed") {
        return res.json({State:"Completed", value: task.Value });
    } else if (["InProgress", "Initiated"].includes(task.State)) {
        return res.json({ State:task.State,value: "" });
    } else {
        return res.status(500).json({ error: 'Unexpected task state' });
    }
});

export default router;
