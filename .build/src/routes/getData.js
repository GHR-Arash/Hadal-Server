import express from 'express';
import { authenticate } from '../middleware/auth';
import { getTaskByWorkspaceAndExternalId } from '../database/dynamo';
const router = express.Router();
router.get('/', authenticate, async (req, res) => {
    const { externalId } = req.query;
    const workspaceId = req.workspaceId;
    const task = await getTaskByWorkspaceAndExternalId(workspaceId, externalId);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    if (task.State === "Completed") {
        return res.json({ State: "Completed", value: task.Value });
    }
    else if (["InProgress", "Initiated"].includes(task.State)) {
        return res.json({ State: task.State, value: "" });
    }
    else {
        return res.status(500).json({ error: 'Unexpected task state' });
    }
});
export default router;
//# sourceMappingURL=getData.js.map