import express from 'express';
import jwt from 'jsonwebtoken';
import { getWorkspaceById } from '../database/dynamo';

const router = express.Router();

router.post('/token', async (req, res) => {
  const { apiAccessKey } = req.body;
  const workspace = await getWorkspaceById(apiAccessKey);

  if (!workspace) {
    return res.status(404).json({ error: 'Workspace not found' });
  }

  const SECRET_KEY = 'YOUR_SECRET_KEY';
  const generateToken = (payload: any, expiresIn: string = '1h') => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

  const token = generateToken({ workspaceId: (workspace as any).id},'1h') ;
  res.json({ token });
});

export default router;
