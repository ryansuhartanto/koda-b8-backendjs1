import { Router } from "express";

import * as users from "#/controllers/user.controller";
import { upload } from "#/lib/upload";

export const userRouter: Router = Router();

userRouter.get("/", users.getAll);
userRouter.get("/:id", users.getId);
userRouter.post("/", users.post);
userRouter.patch("/:id", users.patch);
userRouter.put("/:id/avatar", upload.single("avatar"), users.putPicture);
userRouter.delete("/:id", users.del);
