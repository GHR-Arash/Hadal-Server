import express from 'express';
import jwt from 'jsonwebtoken';
import { getWorkspaceById } from '../database/dynamo';

const router = express.Router();

router.post('/', async (req, res) => {
  let workspace;
  const body = req.body; 
  const apiAccessKey = body.apiaccesskey; 


  workspace = await getWorkspaceById(apiAccessKey);
  if (!workspace) {
    res.status(404).json({ 
      isBase64Encoded: false,
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Workspace not found' })
  });
  } else {
    const SECRET_KEY = process.env.JWT_SECRET; 
    const generateToken = (payload: any, expiresIn: string = '1h') => {
      return jwt.sign(payload, SECRET_KEY, { expiresIn });
  };
    console.log(`workspace got form db : ${JSON.stringify(workspace)}`);
    console.log(`workspaceID got form db : ${(workspace as any).Item.workspaceId}`);
    const token = generateToken({ workspaceId: (workspace as any).Item.workspaceId},'1h') ;
    res.json({ token });
  }

});

export default router;
