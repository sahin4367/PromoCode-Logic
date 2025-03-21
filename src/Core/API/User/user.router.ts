import { Router } from "express";
import { UserController } from "./user.controller";

export const userRouter = Router();
const controller = UserController;

userRouter.post('/register' , controller.userRegister )
userRouter.post('/login' , controller.userLogin )
userRouter.post('/verify-email' , controller.verifyEmail )
userRouter.post('/check-verify-code' , controller.checkVerifyCode )
