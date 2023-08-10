import express from 'express';
import serverless from 'serverless-http';
import tokenRouter from './routes/token';
import setDataRouter from './routes/setData';
import getDataRouter from './routes/getData';

const app = express();

app.use('/token', tokenRouter);
app.use('/setData',setDataRouter);
app.use('/getData',getDataRouter);

module.exports.handler = serverless(app);
