import express from "express";
import mongoose from "mongoose";
import router from './routes'
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

app.listen(PORT, () => {
  console.log("Сервер запущен");
});
