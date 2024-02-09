import SharingTask from "App/Models/SharingTask";
import BaseRepository from "./base.repository";
import { IPagination } from "App/Helpers/contracts/pagination";

export class SharingTaskRepository extends BaseRepository {
  constructor() {
    super(SharingTask);
  }

  async findAllWithAssociation(pagination: IPagination, filter?: any) {
    if (pagination.withPagination) {
      const sharingTasks = await SharingTask.query()
        .where((builder) => {
          if (filter && filter.finished) {
            console.log(filter.finished);
            builder.where("finished", filter.finished);
          }
          if (filter && filter.userId) {
            builder.where("user_id", filter.userId);
          }
        })
        .preload("task")
        .preload("user")
        .paginate(pagination.page || 1, pagination.perPage || 5);
      return {
        total: sharingTasks.total,
        page: sharingTasks.currentPage,
        perPage: sharingTasks.perPage,
        data: sharingTasks.all().map((d) => d.toJSON()),
      };
    }

    return await SharingTask.query()
      .where((builder) => {
        if (filter && filter.finished) {
          builder.where("finished", filter.finished);
        }
        if (filter && filter.userId) {
          builder.where("user_id", filter.userId);
        }
      })
      .preload("task")
      .preload("user");
  }
}
