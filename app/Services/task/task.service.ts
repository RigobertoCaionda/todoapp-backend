import { IPagination } from "App/Helpers/contracts/pagination";
import { TaskRepository } from "App/Repositories/task.repository";
import { TaskProps } from "App/Types/task.type";

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  public async query(pagination: IPagination, filters?: any) {
    const relations = ["priority", "user"];

    return await this.taskRepository.findAll(pagination, relations, filters);
  }

  public async findOne(id: number) {
    return await this.taskRepository.findById(id, ["priority", "user"]);
  }

  public async execute(taskDto: TaskProps) {
    if (!taskDto.descricao) {
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
    return await this.taskRepository.create(taskDto);
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
