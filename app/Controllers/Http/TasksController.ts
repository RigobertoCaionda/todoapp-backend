import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { Util } from "App/Helpers/Util";
import { IPagination } from "App/Helpers/contracts/pagination";

import { TaskRepository } from "App/Repositories/task.repository";
import { TaskService } from "App/Services/task/task.service";
import { TaskProps } from "App/Types/task.type";

export default class TasksController {
  private taskService: TaskService;
  constructor() {
    this.taskService = new TaskService(new TaskRepository());
  }

  public async index({ response, request }: HttpContextContract) {

    const pagination: IPagination = Util.transformPagination(request.all());
    const filters = request.qs().filters; // Consegue pegar objeto filters

    const result = await this.taskService.query(pagination, filters);
    return response.json(result);
  }

  public async show({ response, params }: HttpContextContract) {
    const { id } = params;
    const result = await this.taskService.findOne(id);
    return response.json(result);
  }

  public async getFinishedTasks({ response }: HttpContextContract) {
    const result = await this.taskService.getFinishedTasks();
    return response.json(result);
  }
  public async getUnFinishedTasks({ response }: HttpContextContract) {
    const result = await this.taskService.getUnFinishedTasks();
    return response.json(result);
  }

  public async store({ response, request, auth }: HttpContextContract) {
    const userId = auth.user?.id;
    const { descricao, endDate, startDate, finished, priorityId } =
      request.all() as TaskProps;

    try {
      const result = await this.taskService.execute({
        descricao,
        endDate,
        startDate,
        finished,
        priorityId,
        userId,
      });
      return response.json(result);
    } catch (error) {
      return error;
    }
  }
  public async update({ response, request, params, auth }: HttpContextContract) {
    const userId = auth.user?.id;
    const { descricao, endDate, startDate, finished, priorityId } =
      request.all() as TaskProps;
    const { id } = params;

    try {
      const result = await this.taskService.update(id, {
        descricao,
        endDate,
        startDate,
        finished,
        priorityId,
        userId,
      });
      return response.json(result);
    } catch (error) {
      return error;
    }
  }

  public async delete({ params, auth }: HttpContextContract) {
    const { id } = params;
    const autheticatedUser = auth?.user?.id as number;

    return await this.taskService.delete(id, autheticatedUser);
  }
  public async getUserTasks({ response, auth }: HttpContextContract) {

    const userId = (auth.user?.id) as number

    const result = await this.taskService.findUserTasks(userId);
    return response.json(result);
  }
}
