import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";
import { Phone } from "./phone.model";
import { PromoCode } from "./promocode.model";

export enum EStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELED = "CANCELED"
}

@Entity({name : "orders"})
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("decimal", { precision: 10, scale: 2 })
    totalPrice: number;

    @ManyToOne(() => PromoCode, { nullable: true })
    @JoinColumn({ name: "promocode_id" })
    promoCode?: PromoCode | null;

    @Column({type : "enum" ,enum : EStatus , default : EStatus.PENDING})
    status: EStatus;

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({name : "user_id"})
    user: User;

    @ManyToOne(() => Phone , phone => phone.orders)
    @JoinColumn({ name : "phone_id"})
    phone: Phone;
}
