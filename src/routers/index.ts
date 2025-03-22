import { Router } from "express";
import { userRouter } from "../Core/API/User/user.router";
import { PromocodeRouter } from "../Core/API/PromoCode/promocode.router";
import { PhoneRouter } from "../Core/API/Phone/phone.router";
import { OrderRouter } from "../Core/API/Order/order.router";
import { PaymentRouter } from "../Core/API/Payment/payment.router";


export const v1Router = Router();

v1Router.use('/users' , userRouter)
v1Router.use('/promocode' , PromocodeRouter)
v1Router.use('/phones' , PhoneRouter)
v1Router.use('/orders' , OrderRouter)
v1Router.use('/payments' , PaymentRouter)

