import { User } from 'src/auth/entities/user.entity';

export class PostDto {
  id?: number;
  body?: string;
  createdAt?: string;
  author?: User;
}
