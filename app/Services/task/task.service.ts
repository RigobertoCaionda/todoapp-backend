import { IPagination } from "App/Helpers/contracts/pagination";
import { TaskRepository } from "App/Repositories/task.repository";

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  public async query(pagination: IPagination) {
   return await this.taskRepository.findAllWithAssociation(pagination);
  }
}
