import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  createAccount(createUserDto: CreateUserDto): Observable<User> {
    const { firstName, lastName, email, password } = createUserDto;

    return this.hashPassword(password)
      .pipe(
        switchMap((hashedPassword: string) => {
          return from(
            this.userRepository.save({
              firstName,
              lastName,
              email,
              password: hashedPassword,
            }),
          );
        }),
      )
      .pipe(
        map((user: User) => {
          delete user.password;
          return user;
        }),
      );
  }

  login(loginUserDto: LoginUserDto): Observable<{ token: string }> {
    return from(this.validateUser(loginUserDto)).pipe(
      switchMap((user: User) => {
        if (user) {
          return from(this.jwtService.signAsync({ user })).pipe(
            map((token: string) => {
              return { token };
            }),
          );
        }
      }),
    );
  }

  private hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  private validateUser(loginUserDto: LoginUserDto): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: {
          email: loginUserDto.email,
        },
        select: ['id', 'firstName', 'lastName', 'email', 'password', 'role'],
      }),
    ).pipe(
      switchMap((user: User) => {
        if (!user) {
          throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }
        return from(bcrypt.compare(loginUserDto.password, user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (!user || !isValidPassword) {
              throw new HttpException(
                { status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' },
                HttpStatus.FORBIDDEN,
              );
            }
            delete user.password;
            return user;
          }),
        );
      }),
    );
  }
}
