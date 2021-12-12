import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const jwtHeader = req.headers.authorization;
    try {
      const payload = this.jwtService.verify(jwtHeader);
      req.user = payload.user;
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
