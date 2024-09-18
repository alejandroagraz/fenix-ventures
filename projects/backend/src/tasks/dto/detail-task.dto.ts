import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { StatusTasks } from '../../common/constants/status-tasks.constant';

export class DetailTaskDto {
  @ApiProperty({ example: 'e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610'})
  @IsUUID('4')
  id: string;

  @ApiProperty({ example: 'Galio Stan del suroeste'})
  title: string;

  @ApiProperty({ example: 'Technician wholly primary Peso Metal opposite matrix expurgate Agent Cargo payment salmon Northwest'})
  description: string;

  @ApiProperty({
    description: 'Status Task',
    enum: StatusTasks,
    type: StatusTasks,
    example: StatusTasks.PENDING,
  })
  status: StatusTasks;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
