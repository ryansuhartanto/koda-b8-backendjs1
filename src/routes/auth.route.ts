import { Router } from "express";

import * as auth from "#/controllers/auth.controller";

export const authRouter: Router = Router();

authRouter.post("/login", auth.login);
