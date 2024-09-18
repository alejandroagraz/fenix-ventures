import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator';
import { StatusTasks } from '../../common/constants/status-tasks.constant';

export class UpdateTaskInput {
  @ApiProperty({ example: 'Galio Stan del suroeste', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Technician wholly primary Peso Metal opposite matrix expurgate Agent Cargo payment salmon Northwest', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Status Task',
    enum: StatusTasks,
    type: StatusTasks,
    example: StatusTasks.PENDING,
    required: false,
  })
  @IsOptional()
  status?: StatusTasks;
}
