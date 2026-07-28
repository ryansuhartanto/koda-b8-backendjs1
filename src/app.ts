import express from "express";
import type { Express } from "express";

import { authMiddleware } from "#/middleware/auth";
import { corsMiddleware } from "#/middleware/cors";
import { authRouter } from "#/routes/auth.route";
import { userRouter } from "#/routes/user.route";

export const app: Express = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(corsMiddleware);

app.use("/auth", authRouter);
app.use("/users", authMiddleware, userRouter);
