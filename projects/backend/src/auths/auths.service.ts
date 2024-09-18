import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthInput } from './inputs/auth.input';
import { UserDto } from '../users/dto/user.dto';
import { UserEntity } from '../users/entity/user.entity';
import { StatusUser } from '../common/constants/status-user.constant';

@Injectable()
export class AuthsService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
  ) {}

  async login(input: AuthInput): Promise<AuthDto> {
    const isUser = await this.validateUser(input);

    const authType = new AuthDto();
    const payload = {
      id: isUser.id,
      sub: isUser.email,
    };
    authType.access_token = this._jwtService.sign(payload);
    return authType;
  }

  async validateUser(input: AuthInput): Promise<UserDto> {
    const { username, password } = input;
    const isUSer: UserEntity = await this._usersService.findOneUser(username);

    if (isUSer) {
      const verifyPassword = await bcrypt.compare(password, isUSer.password);

      if (isUSer.status == StatusUser.INACTIVE) {
        throw new HttpException(
          'User has been suspended',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (!verifyPassword) {
        throw new HttpException(
          'Username, mail, or Password is incorrect',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (verifyPassword && isUSer.status == StatusUser.ACTIVE) {
        return isUSer;
      }
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
