import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthInput } from './inputs/auth.input';
import { AuthDto } from './dto/auth.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Auths')
@Controller('auths')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly _authsService: AuthsService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login with username or email and password',
  })
  @ApiBody({
    description: 'Log in',
    type: AuthInput,
  })
  @ApiCreatedResponse({
    description: 'The user has successfully logged in',
    type: AuthDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Username, email or Password is incorrect',
  })
  async login(@Body() auth: AuthInput): Promise<AuthDto> {
    return await this._authsService.login(auth);
  }
}
