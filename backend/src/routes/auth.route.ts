import { Router } from "express";
import { getCurrentUserController, userLoginController, UserRegisterController } from "../controllers/user.controller";
import { authMiddleWare } from "../middleware/auth.middleware";


const authRouter = Router();
authRouter.post("/register", UserRegisterController);
authRouter.post("/login", userLoginController);
authRouter.get("/me", authMiddleWare, getCurrentUserController);

export default authRouter;