import { Router } from "express";
import { OrderController } from "./order.controller";
import { useAuth } from "../../Midddlewares/user.middleware";
import { adminAuth } from "../../Midddlewares/admin.middleware";

export const OrderRouter = Router();
const controller = OrderController;

OrderRouter.post('/create' , useAuth, adminAuth, controller.createOrder)
OrderRouter.get('/list' , useAuth , adminAuth , controller.getOrderList)
OrderRouter.put('/update/:id' , useAuth , adminAuth, controller.updateOrder)
OrderRouter.put('/delete/:id' , useAuth , adminAuth, controller.softDeleteOrder)
