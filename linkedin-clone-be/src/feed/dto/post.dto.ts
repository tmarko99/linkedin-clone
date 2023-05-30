import { CreateUserDto } from './../../auth/dto/create-user.dto';

export class PostDto {
  id?: number;
  body?: string;
  createdAt?: Date;
  author?: CreateUserDto;
}
