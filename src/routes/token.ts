import express from 'express';
import jwt from 'jsonwebtoken';
import { getWorkspaceById } from '../database/dynamo';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log("Received a request for token generation");
  const { apiAccessKey } = req.body;
  const workspace = await getWorkspaceById(apiAccessKey);
  res.json({ message: "Token router static response" });
});
// router.post('/', async (req, res) => {
//   console.log("Received a request for token generation");
//   const { apiAccessKey } = req.body;
//   const workspace = await getWorkspaceById(apiAccessKey);

//   if (!workspace) {
//     res.status(404).json({ 
//       isBase64Encoded: false,
//       statusCode: 404,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ error: 'Workspace not found' })
//   });
//   }

//   const SECRET_KEY = process.env.JWT_SECRET; 
//   const generateToken = (payload: any, expiresIn: string = '1h') => {
//     return jwt.sign(payload, SECRET_KEY, { expiresIn });
// };

//   const token = generateToken({ workspaceId: (workspace as any).id},'1h') ;
//   res.json({ token });
// });

export default router;
