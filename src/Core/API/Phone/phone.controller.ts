import { Request,Response,NextFunction } from "express";
import { Phone } from "../../../DAL/models/phone.model";

interface UpdatePhoneDTO {
    title  : string;
    price : number;
}

const createPhone = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const {title,price} = req.body;
        if (!title || !price) {
            res.status(400).json({
                message : `Butun melumatlari  daxil edin~!`
            });
            return;
        }

        const phone = new Phone();
        phone.title = title;
        phone.price = price;

        const savedPhone = await Phone.save(phone);
        res.status(201).json(savedPhone);
        return;
    } catch (error:any) {
        res.status(500).json({
            message : `Xeta bas verdi~!`
        });
        return;
    }
}

const getList = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const phones = await Phone.find({
            relations : ["orders"]
        });
        res.status(200).json(phones)
    } catch (error:any) {
        res.status(500).json({message : `Xeta bas verdi~!`})
        return;        
    }
}

const updatePhone = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const phoneId = Number(req.params.id);
        const updateData : UpdatePhoneDTO = req.body;
        const phone = await Phone.findOne({
            where : {id : phoneId}
        });
        if (!phone) {
            res.status(404).json({
                message : `Phone npt found~!`
            });
            return;
        }

        Object.assign(phone,updateData);

        const updatePhone = await phone.save();
        res.status(200).json({
            message: `Book successfully updated~!`,
            book: {
                title: updatePhone.title,
                price: updatePhone.price,
            }
        });
    } catch (error:any) {
        res.status(500).json({
            message : `Xeta bas verdi~!`
        });
        return;
    }
}

const sogftDeletePhone = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const idPhone = Number(req.params.id);
        const phoneData = await Phone.findOne({
            where : {id : idPhone}
        });
        if (!phoneData) {
            res.status(404).json({
                message : `Phone not foundd~!`
            });
            return;
        }
        const deletedPhone = await Phone.update(idPhone , {
            isdeleted : true,
            deleted_at : new Date()
        })
        res.status(201).json({
            message : `Phone successfully deleted~!`
        });
        return;
    } catch (error : any) {
        res.status(500).json({
            mesage : `Xeta bas verdi~!`
        });
        return;
    }
}


export const PhoneController = {
    createPhone,
    getList,
    updatePhone,
    sogftDeletePhone,
}