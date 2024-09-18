import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { Gender } from '../../common/constants/gender.constant';
import { StatusUser } from '../../common/constants/status-user.constant';

export class UpdateUserInput {
  @ApiProperty({ example: 'Leonel', required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ example: 'Messi', required: false })
  @IsOptional()
  @IsString()
  readonly lastname?: string;

  @ApiProperty({ example: '12345678', required: false, type: String })
  @IsOptional()
  @IsNumberString()
  readonly dni?: number;

  @ApiProperty({ example: 'goat10', required: false })
  @IsOptional()
  @IsString()
  readonly username?: string;

  @ApiProperty({
    description: 'Gender',
    enum: Gender,
    type: Gender,
    example: Gender.MAN,
    required: false,
  })
  @IsOptional()
  readonly gender?: Gender;

  @ApiProperty({
    description: 'Status User',
    enum: StatusUser,
    type: StatusUser,
    example: StatusUser.INACTIVE,
    required: false,
  })
  @IsOptional()
  readonly status?: StatusUser;

  @ApiProperty({ example: '123 1234567', required: false })
  @IsOptional()
  @IsString()
  readonly phone?: string;

  @ApiProperty({
    example: 'Cra. 87 #30-65, Medellín, Antioquia, Colombia',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly address?: string;

  @ApiProperty({ example: 'goat10@email.com', required: false })
  @IsOptional()
  @IsString()
  readonly email?: string;
}
