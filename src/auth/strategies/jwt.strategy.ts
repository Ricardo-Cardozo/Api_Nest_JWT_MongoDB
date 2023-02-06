import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { User } from 'src/users/models/user.model';
import { AuthService } from '../auth.service';
import { JwtPayloadUser } from '../models/jwt-payload.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: authService.returnJwtExtractor(),
      ignoreExpiration: false,
      secretOrKey: 'meusecretjwt@12345',
    });
  }

  async validate(jwtPayloadUser: JwtPayloadUser): Promise<User> {
    const user = await this.authService.validateUser(jwtPayloadUser);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
