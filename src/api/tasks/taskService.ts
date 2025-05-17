import { type Repository, In } from 'typeorm';
import { Task } from '@/entities/Task';
import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { getRepository } from '@/common/models/repository';

export class TaskService {
  private taskRepository!: Repository<Task>;

  async init() {
    this.taskRepository = await getRepository(Task);
  }

  async findAll(
    incidentsIds: number[],
  ): Promise<ServiceResponse<Task[] | null>> {
    try {
      const tasks = await this.taskRepository.find({
        where: { caseId: In(incidentsIds) },
      });

      if (!tasks || tasks.length === 0) {
        return ServiceResponse.failure(
          'No tasks found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }

      return ServiceResponse.success<Task[]>('Tasks found', tasks);
    } catch (error) {
      const errorMessage = `Error finding tasks for incidentsIds=${incidentsIds.toString()}: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while retrieving tasks.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIncidentId(
    incidentId: number,
  ): Promise<ServiceResponse<Task[] | null>> {
    try {
      const tasks = await this.taskRepository.find({
        where: { caseId: incidentId },
      });

      if (!tasks || tasks.length === 0) {
        return ServiceResponse.failure(
          'No tasks found for the given incident ID',
          null,
          StatusCodes.NOT_FOUND,
        );
      }

      return ServiceResponse.success<Task[]>('Tasks found for incident', tasks);
    } catch (error) {
      const errorMessage = `Error finding tasks by incidentId=${incidentId}: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while retrieving tasks.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(taskId: number): Promise<ServiceResponse<Task | null>> {
    try {
      const task = await this.taskRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.case', 'incident')
        .leftJoinAndSelect('task.asset', 'asset')
        .where('task.taskId = :taskId', { taskId })
        .getOne();

      if (!task) {
        return ServiceResponse.failure(
          'Task not found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }

      return ServiceResponse.success<Task>('Task found', task);
    } catch (error) {
      const errorMessage = `Error finding task with id=${taskId}: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding the task.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(task: Partial<Task>): Promise<ServiceResponse<Task | null>> {
    try {
      const newTask = await this.taskRepository.save(task);
      return ServiceResponse.success<Task>('Task created', newTask);
    } catch (error) {
      const errorMessage = `Error creating task: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while creating the task.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    task: Partial<Task>,
  ): Promise<ServiceResponse<Partial<Task> | null>> {
    try {
      const { taskId } = task;
      if (!taskId) {
        return ServiceResponse.failure(
          'Task ID is required',
          null,
          StatusCodes.BAD_REQUEST,
        );
      }

      const result = await this.taskRepository.update(taskId, task);

      if (result.affected === 0) {
        return ServiceResponse.failure(
          'Task not found for update',
          null,
          StatusCodes.NOT_FOUND,
        );
      }

      return ServiceResponse.success<Partial<Task>>(
        'Task updated successfully',
        task,
      );
    } catch (error) {
      const errorMessage = `Error updating task with id=${task.taskId}: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while updating the task.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const taskService = new TaskService();
