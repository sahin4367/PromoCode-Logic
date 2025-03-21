import { Router } from "express";
import { PromocodeController } from "./promocode.controller";
import { adminAuth } from "../../Midddlewares/admin.middleware";
import { useAuth } from "../../Midddlewares/user.middleware";

export const PromocodeRouter = Router();
const controller = PromocodeController;

PromocodeRouter.post('/create' , useAuth ,adminAuth, controller.createPromoCode)
PromocodeRouter.post('/apply-code' , useAuth ,adminAuth, controller.applyPromoCode)