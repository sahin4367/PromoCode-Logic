import { IsEmail, IsEnum, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { EUserRole } from "../../../DAL/models/user.model";
import { error } from "console";


export class RegisterDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    name:string;

    @IsEmail()
    email:string;

    @IsString()
    @MinLength(6)
    @MaxLength(10)
    password:string;

    @IsEnum(EUserRole)
    role:EUserRole;
}