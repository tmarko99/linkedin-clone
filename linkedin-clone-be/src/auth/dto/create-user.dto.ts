import { IsEmail, IsEnum, IsNotEmpty, IsString, Min } from 'class-validator';
import { Role } from '../entities/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Min(8)
  password: string;

  imagePath?: string;
  @IsEnum(Role)
  role?: Role;
}
