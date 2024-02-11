import Task from "App/Models/Task";
import BaseRepository from "./base.repository";
import { IPagination } from "App/Helpers/contracts/pagination";

export class TaskRepository extends BaseRepository {
  constructor() {
    super(Task)
  }

  async findAllWithAssociation(pagination: IPagination, filter?: any) {
    if(pagination.withPagination) {
      const tasks = await Task.query()
      .where((builder) => {
        if (filter && filter.finished) {
          builder.where("finished", filter.finished);
        }
        if (filter && filter.userId) {
          builder.where("user_id", filter.userId);
        }
      })
      .preload("priority")
      .preload("user")
      .preload('sharedTasks')
      .paginate(pagination.page || 1, pagination.perPage || 5)
      return {
        total: tasks.total,
        page: tasks.currentPage,
        perPage: tasks.perPage,
        data: tasks.all().map((d) => d.toJSON()),
      };
    }

    return await Task.query()
      .where((builder) => {
        if (filter && filter.finished) {
          builder.where("finished", filter.finished);
        }
        if (filter && filter.userId) {
          builder.where("user_id", filter.userId);
        }
      })
      .preload("priority")
      .preload("sharedTasks")
      .preload("user");
  }

  async findIdWithAssociation(id: number) {
     const task = await Task.query().where('id', id).preload("priority").preload("user");
     return task[0]
  }
}
