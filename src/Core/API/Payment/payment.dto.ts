import { IsEAN, IsEnum, IsNumber, IsString } from "class-validator";
import { EPaymentStatus } from "../../../DAL/models/payment.model";
export class PaymentDTO {
    @IsNumber()
    amount: number;

    @IsString()
    currency: string;

    @IsEnum(EPaymentStatus)
    status: EPaymentStatus;
}