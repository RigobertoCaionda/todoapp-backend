import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Util } from 'App/Helpers/Util';
import { IPagination } from 'App/Helpers/contracts/pagination';

import { TaskRepository } from "App/Repositories/task.repository";
import { TaskService } from "App/Services/task/task.service";

export default class TasksController {
  private taskService: TaskService
  constructor() {
    this.taskService = new TaskService(new TaskRepository())
  }

  public async index({ response, request }: HttpContextContract) {
    const pagination: IPagination = Util.transformPagination(request.all())
    const result = await this.taskService.query(pagination)
    return response.json(result)
  }
}
