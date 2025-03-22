import { Request,Response,NextFunction } from "express";
import { User } from "../../../DAL/models/user.model";
import { Phone } from "../../../DAL/models/phone.model";
// import { PromoCode } from "../../../DAL/models/promocode.model";
import { EStatus, Order } from "../../../DAL/models/order.model";

interface CreateOrderDTO {
    userId: number;
    phoneId: number;
    // promoCodeId?: number; 
    totalPrice: number;
}

const createOrder = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const { userId, phoneId, totalPrice }: CreateOrderDTO = req.body;
        if (!userId || !phoneId || !totalPrice) {
            res.status(400).json({ message: `Pliase, all required information~!` });
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
        const phone = await Phone.findOne({ 
            where: { id: phoneId }
        });
        // const promoCode = promoCodeId ? await PromoCode.findOne({ where: { id: promoCodeId } }) : undefined;

        if (!user || !phone) {
            res.status(404).json({ message: `User or Phone not found~!` });
            return;
        }

        const order = new Order();
        order.user = user;
        order.phone = phone;
        // order.promoCode = promoCode;
        order.totalPrice = totalPrice;
        order.status = EStatus.PENDING;

        const savedOrder = await order.save();
        res.status(201).json({
            message : `Order successfully created~!`,
            order : savedOrder,
        });
    } catch (error:any) {
        res.status(500).json({
            message : `An error occurred~!`
        });
        return;
    }
}


const getOrderList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orders = await Order.find({
            relations: ["user", "phone", "promoCode"],
            select : {
                user : {
                    id : true,
                    name : true,
                    email : true,
                },
                phone : {
                    id : true,
                    title : true,
                    price : true,
                },
                promoCode : {
                    id : true,
                    code : true
                }
            }
        });
        res.status(200).json(orders);
    } catch (error: any) {
        res.status(500).json({ message: `An error occurred~!` });
    }
};

const updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orderId = Number(req.params.id);
        const { status }: { status: EStatus } = req.body;

        const order = await Order.findOne({
            where: { id: orderId },
            relations: ["user", "phone", "promoCode"],
            select  : {
                user : {
                    id : true,
                    name : true,
                    email  : true,
                },
                phone : {
                    id : true,
                    title : true,
                    price : true,
                },
                promoCode : {
                    id : true,
                    code : true,
                }
            }
        });
        if (!order) {
            res.status(404).json({ message: `Order not found~!` });
            return;
        }

        if (status) {
            order.status = status;
        }

        const updatedOrder = await order.save();
        res.status(200).json({
            message: `Order successfully updated~!`,
            order: updatedOrder,
        });
    } catch (error: any) {
        res.status(500).json({ message: `An error occurred~!` });
    }
};

const softDeleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orderId = Number(req.params.id);

        const order = await Order.findOne({ where: { id: orderId } });
        if (!order) {
            res.status(404).json({ message: `Order not found~!` });
            return;
        }

        const deletedOrder = await Order.update(orderId , {
            isdeleted : true,
            deleted_at : new Date()
        });


        order.status = EStatus.CANCELED;
        res.status(201).json({
                message : `Order successfully deleted~!`
        });
        return;
    } catch (error: any) {
        res.status(500).json({ message: `An error occurred~!` });
    }
};

export const OrderController = {
    createOrder,
    getOrderList,
    updateOrder,
    softDeleteOrder,
}