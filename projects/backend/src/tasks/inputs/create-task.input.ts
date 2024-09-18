import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { StatusTasks } from '../../common/constants/status-tasks.constant';

export class CreateTaskInput {
  @ApiProperty({ example: 'Galio Stan del suroeste', required: true })
  @IsNotEmpty({ message: 'The title is required' })
  @MinLength(3, {
    message: 'Length error for title min 3',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  title: string;

  @ApiProperty({ example: 'Technician wholly primary Peso Metal opposite matrix expurgate Agent Cargo payment salmon Northwest', required: true })
  @IsNotEmpty({ message: 'The description is required' })
  @MinLength(3, {
    message: 'Length error for description min 3',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Status Task',
    enum: StatusTasks,
    type: StatusTasks,
    example: StatusTasks.PENDING,
    required: true,
  })
  @IsNotEmpty({ message: 'The status is required' })
  @IsEnum(StatusTasks)
  status: StatusTasks;
}
