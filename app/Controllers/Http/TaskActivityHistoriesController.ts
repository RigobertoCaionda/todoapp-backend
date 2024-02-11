import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TaskActivityHistoryRepository } from 'App/Repositories/task-activity-history.repository'
import { TaskActivityHistoryService } from 'App/Services/task-activity-history/task-activity-history.service'
import { TaskActivityHistoryProps } from 'App/Types/task-activity-history.type'

export default class TaskActivityHistoriesController {
  private taskActivityHistoryService: TaskActivityHistoryService
  constructor() {
    this.taskActivityHistoryService = new TaskActivityHistoryService(new TaskActivityHistoryRepository())
  }

  public async store({ request, response }: HttpContextContract) {
    const { action, taskId, userId } = request.all() as TaskActivityHistoryProps
    const result = await this.taskActivityHistoryService.execute({ action, taskId, userId })
    return response.json(result)
  }
}
