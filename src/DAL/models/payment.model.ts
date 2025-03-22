import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.model";
import { User } from "./user.model";

export enum EPaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}
@Entity({name : "payments"})
export class Payment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    amount : number;

    @Column()
    currency : string;

    @Column({type : "enum" , enum : EPaymentStatus , default : EPaymentStatus.PENDING})
    status : EPaymentStatus;

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;

    @DeleteDateColumn()
    deletedAt : Date;

    @ManyToOne(() => Order , order => order.payments , {onDelete : "CASCADE"})
    @JoinColumn({name : "orderId"})
    orders : Order;

    @ManyToOne(() => User , user => user.payments, {onDelete : "CASCADE"})
    @JoinColumn({name : "userId"})
    users : User;
}