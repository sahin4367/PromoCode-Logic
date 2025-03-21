import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class CreateOrderDTO {
    @IsNumber()
    userId: number;

    @IsNumber()
    phoneId: number;

    @IsOptional()
    @IsNumber()
    promoCodeId?: number;

    @IsPositive()
    totalPrice: number;
}
