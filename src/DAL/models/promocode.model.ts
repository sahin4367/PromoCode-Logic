import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name : "promocodes"})
export class PromoCode extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({unique : true})
    code : string;

    @Column()
    discountPercentage : number;

    @CreateDateColumn()
    createdAt : Date;

    @Column({type : "timestamp"})
    expiresAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;

    @Column({default : 0})
    userLimit : number;

    @Column({default  : true})
    isActive : boolean;
}