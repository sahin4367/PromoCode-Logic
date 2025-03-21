import { BaseEntity, Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.model";

@Entity({name : "phonies"})
export class Phone extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price: number;

    @Column({default : false})
    isdeleted : boolean;

    @DeleteDateColumn({type : "datetime" , nullable : true})
    deleted_at : Date;


    @OneToMany(() => Order , (orders) => orders.phone)
    orders : Order[];
}