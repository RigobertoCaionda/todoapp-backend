import Task from "App/Models/Task";
import BaseRepository from "./base.repository";
import { IPagination } from "App/Helpers/contracts/pagination";

export class TaskRepository extends BaseRepository {
  constructor() {
    super(Task)
  }

  async findAllWithAssociation(pagination: IPagination) {
    if(pagination.withPagination) {
      const tasks = await Task.query().preload("priority").preload("user").paginate(pagination.page || 1, pagination.perPage || 5)
      return {
        total: tasks.total,
        page: tasks.currentPage,
        perPage: tasks.perPage,
        data: tasks.all().map((d) => d.toJSON()),
      };
    }
    return await Task.query().preload("priority").preload("user");
  }
}
