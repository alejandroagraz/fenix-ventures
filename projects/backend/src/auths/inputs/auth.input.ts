import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthInput {
  @ApiProperty({
    example: 'email -> admin@email.com OR username -> admin',
    required: true,
  })
  @IsNotEmpty({ message: 'The username is required' })
  @IsString()
  @MinLength(3, {
    message: 'Length error for username min 6',
  })
  @MaxLength(50, {
    message: 'Length username for email max 50',
  })
  readonly username: string;

  @ApiProperty({ example: 'Passw*123', required: true })
  @IsNotEmpty({ message: 'The password is required' })
  @IsString()
  @MinLength(8, {
    message: 'Length error for password min 8',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'At least 1 upper case letter, 1 lower case letter, 1 number or special character and min length 8 character.',
  })
  readonly password: string;
}
