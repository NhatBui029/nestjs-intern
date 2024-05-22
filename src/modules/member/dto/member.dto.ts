import { IsOptional, IsUrl, Matches } from "class-validator";

export class MemberDTO{
    id?: number;

    name?: string;

    username?: string;

    @IsOptional()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long'
    })
    password?: string;
 
    @IsOptional()
    @IsUrl()
    avatar?: string 
}