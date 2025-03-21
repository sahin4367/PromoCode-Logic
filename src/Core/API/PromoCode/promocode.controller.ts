import { Request, Response, NextFunction } from "express";
import { Order } from "../../../DAL/models/order.model";
import { PromoCode } from "../../../DAL/models/promocode.model";


    interface CreatePromoCodeDTO {
        code: string;
        discountPercentage: number;
        expiresAt: string;
        userLimit?: number;
    }

    const createPromoCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { code, discountPercentage, expiresAt, userLimit = 0 }: CreatePromoCodeDTO = req.body;

            if (!code || !discountPercentage || !expiresAt) {
                res.status(400).json({ message: "Please provide all required fields~!" });
                return;
            }

            const existingPromo = await PromoCode.findOne({ where: { code } });
            if (existingPromo) {
                res.status(400).json({ message: "This promo code already exists~!" });
                return;
            }

            const promo = new PromoCode();
            promo.code = code.toUpperCase();
            promo.discountPercentage = discountPercentage;
            promo.expiresAt = new Date(expiresAt);
            promo.isActive = true;
            promo.userLimit = userLimit;

            await promo.save();

            res.status(201).json({ message: "Promo code created successfully~!", promo });
        } catch (error: any) {
            res.status(500).json({ message: "An error occurred~!", error });
        }
    };

const applyPromoCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { orderId, code } = req.body;

        const order = await Order.findOne({ where: { id: orderId } });
        if (!order) {
            res.status(404).json({ message: `Order not found~!` });
            return;
        }

        if (order.promoCode) {
            res.status(400).json({ message: "This promo code  already  apply to this order~!" });
            return;
        }

        const promo = await PromoCode.findOne({ where: { code } });
        if (!promo || !promo.isActive || new Date(promo.expiresAt) <= new Date()) {
            res.status(400).json({ message: `The promo code is invalid~!` });
            return;
        }

        const orderCount = await Order.count({ 
            where: { promoCode: 
                { 
                    id: promo.id 
                } 
            } 
        });

        //busines logic:
        if (promo.userLimit > 0 && orderCount >= promo.userLimit) {
            res.status(400).json({ message: `The promo code usage limit has been reached~!` });
            return;
        }

        order.totalPrice = Math.max(0, order.totalPrice - order.totalPrice * (promo.discountPercentage / 100));
        order.promoCode = promo;
        await order.save();

        res.status(200).json({ message: "Promo code successfully applied~!", order });
    } catch (error: any) {
        res.status(500).json({ message: "An error occurred~!", error });
    }
};

export const PromocodeController = {
    applyPromoCode,
    createPromoCode
};
