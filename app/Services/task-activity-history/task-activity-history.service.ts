import { IPagination } from "App/Helpers/contracts/pagination";
import { TaskActivityHistoryRepository } from "App/Repositories/task-activity-history.repository";
import { TaskActivityHistoryProps } from "App/Types/task-activity-history.type";

export class TaskActivityHistoryService {
  constructor(private taskActivityHistoryRepository: TaskActivityHistoryRepository) {}

  public async query(pagination: IPagination, filter?: any) {
    return this.taskActivityHistoryRepository.findAllWithAssociation(pagination, filter)
  }
  public async execute(taskActivityHistoryDto: TaskActivityHistoryProps) {
    if(!taskActivityHistoryDto.action) {
      return {
        error: 'action is required'
      }
    }
    if(!taskActivityHistoryDto.userId) {
      return {
        error: 'userId is required'
      }
    }
    if(!taskActivityHistoryDto.taskId) {
      return {
        error: 'taskId is required'
      }
    }
    return await this.taskActivityHistoryRepository.create(taskActivityHistoryDto)
  }
}
