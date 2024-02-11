import TaskActivityHistory from "App/Models/TaskActivityHistory";
import BaseRepository from "./base.repository";
import { IPagination } from "App/Helpers/contracts/pagination";

export class TaskActivityHistoryRepository extends BaseRepository {
  constructor() {
    super(TaskActivityHistory);
  }

  async findAllWithAssociation(pagination: IPagination, filter?: any) {
    if (pagination.withPagination) {
      const taskActivityHistories = await TaskActivityHistory.query()
        .where((builder) => {
          if (filter && filter.userId) {
            builder.where("user_id", filter.userId);
          }
        })
        .preload("task")
        .preload("user")
        .paginate(pagination.page || 1, pagination.perPage || 5);
      return {
        total: taskActivityHistories.total,
        page: taskActivityHistories.currentPage,
        perPage: taskActivityHistories.perPage,
        data: taskActivityHistories.all().map((d) => d.toJSON()),
      };
    }

    return await TaskActivityHistory.query()
      .where((builder) => {
        if (filter && filter.userId) {
          builder.where("user_id", filter.userId);
        }
      })
      .preload("task")
      .preload("user");
  }
}
