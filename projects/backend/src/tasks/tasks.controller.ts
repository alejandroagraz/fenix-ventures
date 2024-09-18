import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auths/guards/jwt-auth.guard';
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PageDto } from '../common/dtos/page.dto';
import { ApiPaginatedResponse } from '../common/dtos/api-pagination-response';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { TaskDto } from './dto/task.dto';
import { DetailTaskDto } from './dto/detail-task.dto';
import { CreateTaskInput } from './inputs/create-task.input';
import { UpdateTaskInput } from './inputs/update-task.input';
import { TasksService } from './tasks.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Tasks')
@ApiBearerAuth('token')
@Controller('tasks')
@UseGuards(ThrottlerGuard)
export class TasksController {
  constructor(private readonly _booksService: TasksService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiExtraModels(PageDto, TaskDto)
  @ApiPaginatedResponse(TaskDto)
  async getAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<TaskDto>> {
    return await this._booksService.getAll(pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a task according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  @ApiOkResponse({
    status: 200,
    description: 'Success response',
    type: [DetailTaskDto],
  })
  async getDetail(@Param('id') id: string): Promise<DetailTaskDto> {
    return await this._booksService.getDetail(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new task' })
  @ApiBody({ type: CreateTaskInput })
  @ApiOkResponse({
    status: 201,
    description: 'Success response',
    type: [TaskDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async create(@Body() newTask: CreateTaskInput): Promise<TaskDto> {
    return await this._booksService.create(newTask);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a task according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiBody({ type: UpdateTaskInput })
  @ApiOkResponse({
    status: 201,
    description: 'Success response',
    type: [TaskDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async update(
    @Param('id') id: string,
    @Body() updateTask: UpdateTaskInput,
  ): Promise<TaskDto> {
    return await this._booksService.update(id, updateTask);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a task according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiOkResponse({ status: 200, description: 'Success remove book' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async deleteOneByID(@Param('id') id: string) {
    return await this._booksService.deleteOneByID(id);
  }
}
