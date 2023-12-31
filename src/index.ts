import express from 'express';
import serverless from 'serverless-http';
import tokenRouter from './routes/token';
import setDataRouter from './routes/setData';
import getDataRouter from './routes/getData';
require('source-map-support').install();
const app = express();
app.use(express.json());

app.use('/token', tokenRouter);
app.use('/setData', setDataRouter);
app.use('/getData', getDataRouter);

export const handler = serverless(app);

//export const handler = async (event: any) => {
   // return {
      //statusCode: 200,
      //headers: { "Content-Type": "application/json" },
      //body: JSON.stringify({ message: "Static response" })
    //};
  //};

