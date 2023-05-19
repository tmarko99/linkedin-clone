import { Role } from '../entities/role.enum';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  imagePath?: string;
  role?: Role;
}
