import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('You are not authorized!');
    }
    return user;
  }
}
