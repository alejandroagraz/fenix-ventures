import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthsService } from './auths.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auths.controller';
import * as fs from 'fs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { UsersJwtStrategy } from './strategies/jwt.strategy';

config();
const _configService = new ConfigService();

@Module({
  imports: [
    JwtModule.register({
      privateKey: fs.readFileSync('src/auths/certs/jwt-private.key', 'utf8'),
      publicKey: fs.readFileSync('src/auths/certs/jwt-public.key', 'utf8'),
      signOptions: {
        algorithm: _configService.get('ALGORITHM'),
        expiresIn: _configService.get('TIME_TOKEN'),
      },
    }),
    TypeOrmModule.forFeature([]),
    PassportModule,
    UsersModule,
  ],
  providers: [AuthsService, UsersJwtStrategy, ConfigService],
  exports: [AuthsService],
  controllers: [AuthController],
})
export class AuthsModule {}
