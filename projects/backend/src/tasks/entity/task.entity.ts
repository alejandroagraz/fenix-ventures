import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Entity, Column } from 'typeorm';
import { IsString } from 'class-validator';
import { StatusTasks } from '../../common/constants/status-tasks.constant';

@Entity({ name: 'tasks' })
export class TaskEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 50 })
  @IsString()
  title: string;

  @Column({ type: 'varchar', length: 250 })
  @IsString()
  description: string;

  // @Column({
  //   type: 'enum',
  //   enum: StatusTasks,
  //   nullable: true,
  //   default: StatusTasks.PENDING,
  // })
  @Column({
    type: 'text',
    nullable: true,
  })
  @IsString()
  status: StatusTasks;
}
