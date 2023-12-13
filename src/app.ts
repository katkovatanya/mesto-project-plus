import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import router from './routes'
import { SERVER_ERROR_MESSAGE, STATUS_SERVER_ERROR } from "./utils/constants";
import { errorLogger, requestLogger } from './logger/expressLogger';
import ErrorHub from './errors/errorHub';

require('dotenv').config();
const { PORT = 3000 } = process.env;
const app = express();
require('express-async-errors');
app.use(requestLogger);
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(router);
app.use(errorLogger);
app.use(ErrorHub);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.statusCode || SERVER_ERROR_MESSAGE).json({
    status: "error",
    message: error.message || STATUS_SERVER_ERROR,
  });
  next();
});

app.listen(PORT, () => {
  console.log("Сервер запущен");
});
