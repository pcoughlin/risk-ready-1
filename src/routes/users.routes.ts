import { Router } from "express";
import SignUpController from "../controllers/user/sign-up.controller";
import VerifyEmailController from "../controllers/user/verify-email.controller";

const userRouter = Router();

userRouter.post('/sign-up', (req, res) => new SignUpController().execute(req, res));
userRouter.post('/verify', (req, res) => new VerifyEmailController().execute(req, res));

export default userRouter;