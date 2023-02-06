import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { User } from 'src/users/models/user.model';
import { Request } from 'express';
import { JwtPayloadUser } from './models/jwt-payload.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly usersModel: Model<User>,
  ) {}

  public async createAccessToken(userId: string): Promise<string> {
    return sign({ userId }, 'meusecretjwt@12345', {
      expiresIn: '1d',
    });
  }

  public async validateUser(jwtPayloadUser: JwtPayloadUser): Promise<User> {
    const userExists = await this.usersModel.findOne({
      _id: jwtPayloadUser.userId,
    });
    if (!userExists) {
      throw new UnauthorizedException('User not found!');
    }

    return userExists;
  }

  private static jwtExtractor(request: Request): string {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new BadRequestException('Bad Request!');
    }

    const token = authHeader.split(' ')[1];

    return token;
  }

  public returnJwtExtractor(): (request: Request) => string {
    return AuthService.jwtExtractor;
  }
}
