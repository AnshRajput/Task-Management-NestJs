import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './DTO/create-task.dto';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './DTO/update-task-status.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksModule } from './tasks.module';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTaskswithfilters(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Get('/:id')
  getTaskbyId(@Param('id') id: string): Promise<Task> {
    console.log(id);
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }

  @Post()
  createTask(@Body() CreateTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTasks(CreateTaskDto);
  }
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }
}
