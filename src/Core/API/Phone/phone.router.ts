import { Router } from "express";
import { PhoneController } from "./phone.controller";
import { useAuth } from "../../Midddlewares/user.middleware";
import { adminAuth } from "../../Midddlewares/admin.middleware";

export const PhoneRouter = Router();
const controller = PhoneController;

PhoneRouter.post("/create" , useAuth,adminAuth,controller.createPhone)
PhoneRouter.get('/list' , controller.getList)
PhoneRouter.put('/update/:id' , useAuth, adminAuth, controller.updatePhone)
PhoneRouter.put('/delete/:id' , useAuth, adminAuth, controller.sogftDeletePhone)

