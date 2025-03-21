import { IsString, IsNumber, IsOptional, IsDateString, Min, Max } from 'class-validator';

export class CreatePromoCodeDTO {
    @IsString()
    code: string;

    @IsNumber()
    @Min(0)
    @Max(100)
    discountPercentage: number;

    @IsDateString()
    expiresAt: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    userLimit?: number;
}
