import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import { TaskDto } from './dto/task.dto';
import { CreateTaskInput } from './inputs/create-task.input';
import { UpdateTaskInput } from './inputs/update-task.input';
import { TaskEntity } from './entity/task.entity';
import { DetailTaskDto } from './dto/detail-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly _taskRepository: Repository<TaskEntity>,
  ) {}

  async getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<TaskDto>> {
    const queryBuilder = this._taskRepository.createQueryBuilder('tasks');

    queryBuilder
      .orderBy('tasks.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getDetail(id: string): Promise<DetailTaskDto> {
    try {
      const task = await this._taskRepository
        .createQueryBuilder('task')
        .where('task.id = :id', { id: id })
        .getOne();

      if (!task) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }

      return task;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async create(data: CreateTaskInput): Promise<TaskDto> {
    const createTask = new TaskEntity();

    createTask.title = data.title;
    createTask.description = data.description;
    createTask.status = data.status;

    try {
      return await this._taskRepository.save(createTask);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async update(id: string, data: UpdateTaskInput): Promise<TaskDto> {
    const date: Date = new Date();
    const updateTask = await this.findOneByID(id);

    if (!updateTask) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    updateTask.title = data.title || updateTask.title;
    updateTask.description = data.description || updateTask.description;
    updateTask.status = data.status || updateTask.status;
    updateTask.updated_at = date;

    try {
      return await this._taskRepository.save(updateTask);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async deleteOneByID(id: string): Promise<any> {
    try {
      const isTask = await this.findOneByID(id);

      if (!isTask) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }

      await this._taskRepository
        .createQueryBuilder('tasks')
        .softDelete()
        .from(TaskEntity)
        .where('tasks.id = :id', { id: id })
        .execute();

      return { status: 200, message: 'Success remove book' };
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async findOneByID(id: string): Promise<TaskEntity> {
    try {
      return await this._taskRepository
        .createQueryBuilder('task')
        .where('task.id = :id', { id: id })
        .getOne();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
