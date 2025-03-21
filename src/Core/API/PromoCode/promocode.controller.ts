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
                res.status(400).json({ message: "Bütün məlumatları daxil edin!" });
                return;
            }

            const existingPromo = await PromoCode.findOne({ where: { code } });
            if (existingPromo) {
                res.status(400).json({ message: "Bu promo kod artıq mövcuddur!" });
                return;
            }

            const promo = new PromoCode();
            promo.code = code.toUpperCase();
            promo.discountPercentage = discountPercentage;
            promo.expiresAt = new Date(expiresAt);
            promo.isActive = true;
            promo.userLimit = userLimit;

            await promo.save();

            res.status(201).json({ message: "Promo kod uğurla yaradıldı!", promo });
        } catch (error: any) {
            res.status(500).json({ message: "Xəta baş verdi!", error });
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
            res.status(400).json({ message: "bu sifarise artiq promocodu tetbiq oplunub~!" });
            return;
        }

        const promo = await PromoCode.findOne({ where: { code } });
        if (!promo || !promo.isActive || new Date(promo.expiresAt) <= new Date()) {
            res.status(400).json({ message: `Promo kod etibarsizdir~!` });
            return;
        }

        const orderCount = await Order.count({ where: { promoCode: { id: promo.id } } });
        if (promo.userLimit > 0 && orderCount >= promo.userLimit) {
            res.status(400).json({ message: `Promo kodun istifadəsi mehdudlasdirilib~!` });
            return;
        }

        order.totalPrice = Math.max(0, order.totalPrice - order.totalPrice * (promo.discountPercentage / 100));
        order.promoCode = promo;
        await order.save();

        res.status(200).json({ message: "Promo kod uğurla tətbiq edildi.", order });
    } catch (error: any) {
        res.status(500).json({ message: "Xəta baş verdi.", error });
    }
};

export const PromocodeController = {
    applyPromoCode,
    createPromoCode
};
