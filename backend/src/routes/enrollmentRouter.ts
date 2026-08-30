import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { connectServerController, generateEnrollmentTokenConroller } from "../controllers/enrollment.controller";

const enrollmentRouter = Router();

enrollmentRouter.post("/", authMiddleWare, generateEnrollmentTokenConroller);
enrollmentRouter.post("/connect", connectServerController);

export default enrollmentRouter;