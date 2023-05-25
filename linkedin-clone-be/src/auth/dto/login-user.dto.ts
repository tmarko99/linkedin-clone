import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Min(8)
  password: string;
}
