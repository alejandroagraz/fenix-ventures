import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: fs.readFileSync('src/auths/certs/jwt-public.key', 'utf8'),
      algorithms: [_configService.get('ALGORITHM')],
    });
  }

  async validate(payload: any) {
    return { id: payload.id, email: payload.sub };
  }
}
