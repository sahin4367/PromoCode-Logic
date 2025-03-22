import { Request, Response, NextFunction } from "express";
import { User } from "../../../DAL/models/user.model";
import { EStatus, Order } from "../../../DAL/models/order.model";
import { EPaymentStatus, Payment } from "../../../DAL/models/payment.model";

const allowedCurrencies = ["USD", "EUR", "AZN"];

const createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, orderId, amount, currency } = req.body;

        if (!userId || !orderId || !amount || !currency) {
            res.status(400).json({ message: "All fields are required~!" });
            return;
        }

        if (!allowedCurrencies.includes(currency)) {
            res.status(400).json({
                message: `Invalid currency. Allowed currencies are: ${allowedCurrencies.join(", ")}`,
            });
            return;
        }

        const user = await User.findOne({ 
            where: { id: userId },
            select : {
                id : true,
                createdAt : true,
                updatedAt : true,
                deletedAt : true,
            }
        });
        if (!user) {
            res.status(404).json({ message: "User not found~!" });
            return;
        }

        const order = await Order.findOne({ 
            where: { id: orderId }, 
            relations: ["payments"] 
        });
        if (!order) {
            res.status(404).json({ message: "Order not found~!" });
            return;
        }

        //validate:
        const totalPaid = order.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

        if (totalPaid >= order.totalPrice) { 
            res.status(400).json({
                message: `Payment already completed for this order! Total paid: ${totalPaid}`,
            });
            return;
        }
        

        const payment = new Payment();
        payment.amount = amount;
        payment.currency = currency;
        payment.status = EPaymentStatus.PENDING; 
        payment.users = user;
        payment.orders = order;

        const savedPayment = await payment.save();

        const newTotalPaid = totalPaid + amount;
        if (newTotalPaid >= order.totalPrice) {
            order.status = EStatus.CANCELED; 
            await order.save();
        }

        savedPayment.status = EPaymentStatus.COMPLETED;
        await savedPayment.save();

        res.status(201).json({
            message: "Payment created successfully~!",
            payment: savedPayment,
        });

    } catch (error: any) {
        res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
};

export const paymentController = {
    createPayment,
};
