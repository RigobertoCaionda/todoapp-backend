import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Util } from 'App/Helpers/Util';
import { SharingTaskRepository } from 'App/Repositories/sharing-task.repository';
import { SharingTaskService } from 'App/Services/sharing-task/sharing-task.service';
import { SharingTaskProps } from 'App/Types/sharing-task.type';

export default class SharingTasksController {
  private sharingTaskService: SharingTaskService
  constructor() {
    this.sharingTaskService = new SharingTaskService(new SharingTaskRepository())
  }
  public async store({ request, response }: HttpContextContract) {
    const { userId, taskId } = request.all() as SharingTaskProps
     const result = await this.sharingTaskService.execute({ userId, taskId })
     return response.json(result)
  }

  public async index({ request, response }: HttpContextContract) {
    const pagination = Util.transformPagination(request.all())
    const filters = request.qs().filters;
    const result = await this.sharingTaskService.query(pagination, filters)
    return response.json(result)
  }
}
