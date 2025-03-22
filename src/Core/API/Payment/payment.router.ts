import { Router } from "express";
import { paymentController } from "./payment.controller";
import { useAuth } from "../../Midddlewares/user.middleware";
import { adminAuth } from "../../Midddlewares/admin.middleware";

export const PaymentRouter = Router();
const controller = paymentController;

PaymentRouter.post('/create', useAuth, adminAuth, controller.createPayment);