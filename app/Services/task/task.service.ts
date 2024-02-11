import Database from "@ioc:Adonis/Lucid/Database";
import { IPagination } from "App/Helpers/contracts/pagination";
import TaskActivityHistory from "App/Models/TaskActivityHistory";
import { TaskRepository } from "App/Repositories/task.repository";
import { TaskProps } from "App/Types/task.type";

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  public async query(pagination: IPagination, filter?: any) {

    return await this.taskRepository.findAllWithAssociation(pagination, filter);
  }

  public async findOne(id: number) {
    return await this.taskRepository.findIdWithAssociation(id);
  }

  public async execute(taskDto) {
    if (!taskDto.description) {
      return {
        error: "Description is required",
      };
    }
    if (!taskDto.priorityId) {
      return {
        error: "PriorityId is required",
      };
    }
    if (!taskDto.userId) {
      return {
        error: "UserId is required",
      };
    }
    let trx;
    let action = 'created';
    try {
      trx = await Database.transaction();
      const task = await this.taskRepository.create(taskDto, { client: trx });
          await TaskActivityHistory.create({ userId: taskDto.userId, taskId: task.id, action }, { client: trx });
           await trx.commit();
           return task;
    } catch (error) {
      if (trx) {
        await trx.rollback();
      }
       return error;
    }
  }

  public async update(id: number, taskDto: TaskProps) {
    const task = await this.findOne(id);

    if (!task) {
      return {
        error: "Task does not exist",
      };
    }
    if (taskDto.userId !== (task as any).userId) {
      return {
        error: "Can not update another users tasks",
      };
    }
    return this.taskRepository.update(id, taskDto);
  }

  public async delete(id: number, autheticatedUser: number) {
    const task = await this.findOne(id);

    if (!task) {
      return {
        error: "Task does not exist",
      };
    }
    if (autheticatedUser !== (task as any).userId) {
      return {
        error: "Can not delete another users tasks",
      };
    }
    return this.taskRepository.delete(id);
  }

  public async findUserTasks(userId: number) {
    if (!userId) {
      return { error: "userId is required" };
    }
    return this.taskRepository.findBy(userId, "user_id");
  }

  public async getFinishedTasks() {
    return this.taskRepository.findBy(true, "finished");
  }
  public async getUnFinishedTasks() {
    return this.taskRepository.findBy(false, "finished");
  }
}
