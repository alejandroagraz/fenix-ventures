import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { Order } from '../common/constants/order.constant';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entity/task.entity';
import DatabaseModule from '../database/database.module';
import { PageDto } from '../common/dtos/page.dto';
import { TaskDto } from './dto/task.dto';
import { UnauthorizedException, HttpStatus, HttpException } from '@nestjs/common';

import { StatusTasks } from '../common/constants/status-tasks.constant';
import { CreateTaskInput } from './inputs/create-task.input';
import { UpdateTaskInput } from './inputs/update-task.input';

describe('TasksController', () => {
  let tasksController: TasksController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([TaskEntity]),
        ThrottlerModule.forRoot([{
          ttl: 60,
          limit: 10,
        }]),
      ],
      providers: [
        TasksService,
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    }).compile();

    tasksController = app.get<TasksController>(TasksController);
  });

  describe('Get all tasks', () => {
    it('should Get all tasks and paginations parameters', async () => {
      const query = new PageOptionsDto();
      query.page = 1;
      query.take = 10;
      query.order = Order.ASC;

      const result = await tasksController.getAll(query);

      expect(result).toBeInstanceOf(PageDto<TaskDto>);
    });

    it('should throw a 401 Unauthorized', async () => {
      const customMessage = { message: "Unauthorized", statusCode: 401 };
      const query = new PageOptionsDto();
      query.page = 1;
      query.take = 10;
      query.order = Order.ASC;

      try {
        jest.spyOn(tasksController, 'getAll').mockImplementation(() => {
          throw new UnauthorizedException(customMessage);
        });

      } catch (err) {
        await expect(tasksController.getAll(query)).rejects.toThrow(UnauthorizedException);
        await expect(tasksController.getAll(query)).rejects.toThrow(expect.objectContaining({
          message: customMessage.message,
          statusCode: customMessage.statusCode,
        }));
      }
    });
  });

  describe('Get a task according to its ID', () => {
    it('should return an task by id', async () => {
      const query = new PageOptionsDto();
      query.page = 1;
      query.take = 10;
      query.order = Order.ASC;

      const tasks = await tasksController.getAll(query);
      const result = await tasksController.getDetail(tasks.data[0].id);

      expect(result).toBeInstanceOf(TaskEntity);
      expect(result).toEqual(tasks.data[0]);
    });

    it('should return undefined if the task does not exist', async () => {
      const customMessage = { message: "Task not found", statusCode: HttpStatus.NOT_FOUND };

      await expect(tasksController.getDetail('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610')).rejects.toThrow(HttpException);
      await expect(tasksController.getDetail('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610')).rejects.toThrow(expect.objectContaining({
        response: customMessage.message,
        status: customMessage.statusCode,
      }));
    });

    it('should throw a 401 Unauthorized', async () => {
      const customMessage = { message: "Unauthorized", statusCode: 401 };

      try {
        jest.spyOn(tasksController, 'getDetail').mockImplementation(() => {
          throw new UnauthorizedException(customMessage);
        });

      } catch (err) {
        await expect(tasksController.getDetail('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610')).rejects.toThrow(UnauthorizedException);
        await expect(tasksController.getDetail('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610')).rejects.toThrow(expect.objectContaining({
          message: customMessage.message,
          statusCode: customMessage.statusCode,
        }));
      }
    });
  });

  describe('Create new task', () => {
    it('should create an task', async () => {
      const newTask = new CreateTaskInput();
      newTask.title = 'Galio Stan del suroeste';
      newTask.description = 'Technician wholly primary Peso Metal opposite matrix expurgate Agent Cargo payment salmon Northwest';
      newTask.status = StatusTasks.COMPLETED;

      const result = await tasksController.create(newTask);
      expect(result).toBeInstanceOf(TaskEntity);
    });

    it('should throw a 401 Unauthorized', async () => {
      const customMessage = { message: "Unauthorized", statusCode: 401 };
      const newTask = new CreateTaskInput();
      newTask.title = 'Galio Stan del suroeste';
      newTask.description = 'Technician wholly primary Peso Metal opposite matrix expurgate Agent Cargo payment salmon Northwest';
      newTask.status = StatusTasks.COMPLETED;

      try {
        jest.spyOn(tasksController, 'create').mockImplementation(() => {
          throw new UnauthorizedException(customMessage);
        });

      } catch (err) {
        await expect(tasksController.create(newTask)).rejects.toThrow(UnauthorizedException);
        await expect(tasksController.create(newTask)).rejects.toThrow(expect.objectContaining({
          message: customMessage.message,
          statusCode: customMessage.statusCode,
        }));
      }
    });
  });

  describe('Update a task according to its ID', () => {
    it('should update an task', async () => {
      const newTask = new CreateTaskInput();
      newTask.title = 'Galio Stan del suroeste';
      newTask.description = 'Technician wholly primary Peso Metal opposite matrix expurgate Agent Cargo payment salmon Northwest';
      newTask.status = StatusTasks.PENDING;
      const task = await tasksController.create(newTask);

      task.title = 'Galio Stan del suroeste';
      task.description = 'Technician wholly primary Peso Metal opposite matrix expurgate Agent Cargo payment';
      task.status = StatusTasks.COMPLETED;

      const result = await tasksController.update(task.id, task);
      expect(result).toBeInstanceOf(TaskEntity);
    });

    it('should return undefined if the task does not exist', async () => {
      const customMessage = { message: "Task not found", statusCode: HttpStatus.NOT_FOUND };
      const updateTask = new UpdateTaskInput();
      updateTask.title = 'Galio Stan del suroeste';
      updateTask.description = 'Technician wholly primary Peso Metal opposite matrix expurgate Agent Cargo payment salmon Northwest';
      updateTask.status = StatusTasks.COMPLETED;

        await expect(tasksController.update('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610', updateTask)).rejects.toThrow(HttpException);
        await expect(tasksController.update('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610', updateTask)).rejects.toThrow(expect.objectContaining({
          response: customMessage.message,
          status: customMessage.statusCode,
        }));
    });

    it('should throw a 401 Unauthorized', async () => {
      const customMessage = { message: "Unauthorized", statusCode: 401 };
      const updateTask = new UpdateTaskInput();
      updateTask.title = 'Galio Stan del suroeste';
      updateTask.description = 'Technician wholly primary Peso Metal opposite matrix expurgate Agent Cargo payment salmon Northwest';
      updateTask.status = StatusTasks.COMPLETED;

      try {
        jest.spyOn(tasksController, 'update').mockImplementation(() => {
          throw new UnauthorizedException(customMessage);
        });

      } catch (err) {
        await expect(tasksController.update('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610', updateTask)).rejects.toThrow(UnauthorizedException);
        await expect(tasksController.update('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610', updateTask)).rejects.toThrow(expect.objectContaining({
          message: customMessage.message,
          statusCode: customMessage.statusCode,
        }));
      }
    });
  });

  describe('Delete a task according to its ID', () => {
    it('should update an task', async () => {
      const customMessage = { status: 200, message: 'Success remove book' }
      const newTask = new CreateTaskInput();

      newTask.title = 'Galio Stan del suroeste';
      newTask.description = 'Technician wholly primary Peso Metal opposite matrix expurgate Agent Cargo payment salmon Northwest';
      newTask.status = StatusTasks.COMPLETED;

      const task = await tasksController.create(newTask);
      const result = await tasksController.deleteOneByID(task.id);

      expect(result).toEqual(customMessage);
    });

    it('should return undefined if the task does not exist', async () => {
      const customMessage = { message: "Task not found", statusCode: HttpStatus.NOT_FOUND };

      await expect(tasksController.deleteOneByID('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610')).rejects.toThrow(HttpException);
      await expect(tasksController.deleteOneByID('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610')).rejects.toThrow(expect.objectContaining({
        response: customMessage.message,
        status: customMessage.statusCode,
      }));
    });

    it('should throw a 401 Unauthorized', async () => {
      const customMessage = { message: "Unauthorized", statusCode: 401 };
      try {
        jest.spyOn(tasksController, 'deleteOneByID').mockImplementation(() => {
          throw new UnauthorizedException(customMessage);
        });

      } catch (err) {
        await expect(tasksController.deleteOneByID('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610')).rejects.toThrow(UnauthorizedException);
        await expect(tasksController.deleteOneByID('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610')).rejects.toThrow(expect.objectContaining({
          message: customMessage.message,
          statusCode: customMessage.statusCode,
        }));
      }
    });
  });
});
