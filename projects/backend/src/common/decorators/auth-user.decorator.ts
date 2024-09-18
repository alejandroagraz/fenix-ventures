import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserDto } from '../../users/dto/user.dto';

export const AuthenticatedAccount = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDto => {
    try {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    } catch (error) {
      throw new ForbiddenException();
    }
  },
);
