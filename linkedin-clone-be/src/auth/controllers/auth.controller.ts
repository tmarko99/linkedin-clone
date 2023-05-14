import { Observable } from 'rxjs';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { LoginUserDto } from '../dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto): Observable<User> {
    return this.authService.createAccount(createUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto): Observable<{ token: string }> {
    return this.authService.login(loginUserDto);
  }
}
