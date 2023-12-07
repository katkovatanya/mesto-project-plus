import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import usersRouter from "./routes/users";
import cardsRouter from "./routes/cards";
import { UserRequest } from "./types";
import { SERVER_ERROR_MESSAGE, STATUS_SERVER_ERROR } from "./constants";

const { PORT = 3000 } = process.env;
const app = express();
require('express-async-errors');
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://localhost:27017/mestodb");

// подключаем мидлвары, роуты и всё остальное...
app.use((req: UserRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: "65708c73979fe70c8171aa5a",
  };

  next();
});

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.statusCode || SERVER_ERROR_MESSAGE).json({
    status: "error",
    message: error.message || STATUS_SERVER_ERROR,
  });
  next();
});

app.listen(PORT, () => {
  console.log("Ссылка на сервер");
});
