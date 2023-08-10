import express from 'express';
import serverless from 'serverless-http';
import tokenRouter from './routes/token';
import setDataRouter from './routes/setData';
import getDataRouter from './routes/getData';
import serverlessHttp from 'serverless-http';

const app = express();

app.use('/token', tokenRouter);
app.use('/setData',setDataRouter);
app.use('/getData',getDataRouter);

module.exports.handler = serverless(app);
