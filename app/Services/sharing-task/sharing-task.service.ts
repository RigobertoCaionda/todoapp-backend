import { IPagination } from "App/Helpers/contracts/pagination";
import { SharingTaskRepository } from "App/Repositories/sharing-task.repository";
import { SharingTaskProps } from "App/Types/sharing-task.type";

export class SharingTaskService {
  constructor(private sharingTaskRepository: SharingTaskRepository) {}

  public async execute(sharingTaskDto: SharingTaskProps) {
    if(!sharingTaskDto.userId) {
      return {
        error: 'userId is required'
      }
    }
    if(!sharingTaskDto.taskId) {
      return {
        error: 'taskId is required'
      }
    }
     return await this.sharingTaskRepository.create(sharingTaskDto)
  }

  public async query(pagination: IPagination, filter?: any) {
    return await this.sharingTaskRepository.findAllWithAssociation(pagination, filter);
  }
}
