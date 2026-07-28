import express from "express";
import type { Express } from "express";

import { userRouter } from "#/routes/user.route";

export const app: Express = express();

app.use(express.json());
app.use(express.urlencoded());

app.use("/users", userRouter);
