import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.model";
import { Payment } from "./payment.model";


export enum EUserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

@Entity({name : "users"})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({type : "enum" , enum : EUserRole , default : EUserRole.ADMIN})
    role: EUserRole;

    @CreateDateColumn({type : "datetime" , nullable : true})
    createdAt: Date;

    @Column({type : "boolean" , default : false})
    isVerifiedEmail : boolean;

    @Column({type : "datetime" , nullable : true})
    codeExpireAt : Date;

    @Column({type : "varchar" , nullable: true})
    verifyCode : string | null;

    @UpdateDateColumn({type : "datetime" , nullable : true})
    updatedAt: Date;

    @DeleteDateColumn({type : "datetime" , nullable : true})
    deletedAt: Date;


    @OneToMany(() => Order , (orders) => orders.user)
    orders : Order[];

    @OneToMany(() => Payment , payment  => payment.users)
    payments : Payment[];

}