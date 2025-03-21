import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class UpdatePhoneDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    title : string;

    @IsNumber()
    price : number;
}