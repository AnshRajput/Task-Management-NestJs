import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './DTO/create-task.dto';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { title } from 'process';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!found) {
      throw new NotFoundException(`Task with ${id} doesnt exists`);
    } else {
      return found;
    }
  }
  getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete({ id: id });
    if (result.affected === 0) {
      throw new NotFoundException('No task Found');
    }
  }
  async createTasks(CreateTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = CreateTaskDto;
    const task = this.taskRepository.create({
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    });
    await this.taskRepository.save(task);
    return task;
  }

  async updateTaskStatus(id: string, status: TaskStatus) {
    await this.getTaskById(id);
    await this.taskRepository.update({ id }, { status: status });
  }

  getTaskswithfilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    if (status) {
      return this.taskRepository.find({ where: { status: status } });
    }
    if (search) {
      return this.taskRepository.find({
        where: {
          title: search.toLowerCase(),
        } || { description: search.toLowerCase() },
      });
    }
    // return this.getAllTasks();
  }
}
