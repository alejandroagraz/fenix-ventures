import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../common/constants/gender.constant';
import { IsUUID } from 'class-validator';
import { StatusUser } from '../../common/constants/status-user.constant';

export class UserDto {
  @ApiProperty({ example: 'e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610'})
  @IsUUID('4')
  id: string;

  @ApiProperty({ example: 'Neymar'})
  name: string;

  @ApiProperty({ example: 'da Silva'})
  lastname: string;

  @ApiProperty({ example: '12345678'})
  dni: number;

  @ApiProperty({ example: 'ney10'})
  username: string;

  @ApiProperty({
    description: 'Gender',
    enum: Gender,
    type: Gender,
    example: Gender.MAN,
  })
  gender: Gender;

  @ApiProperty({
    description: 'Status User',
    enum: StatusUser,
    type: StatusUser,
    example: StatusUser.ACTIVE,
  })
  status: StatusUser;

  @ApiProperty({ example: '123 1234567'})
  phone: string;

  @ApiProperty({
    example: 'Cra. 87 #30-65, Medellín, Antioquia, Colombia',
  })
  address: string;

  @ApiProperty({ example: 'ney10@email.com'})
  email: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
