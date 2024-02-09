import { BaseModel } from "@ioc:Adonis/Lucid/Orm";
import { IPagination } from "App/Helpers/contracts/pagination";
export default abstract class BaseRepository {
  constructor(private model: typeof BaseModel) {}

  public async findAll(pagination: IPagination) {
    if (!pagination.withPagination) {
      const data = await this.model.query();
      return data.map((item) => item.serialize());
    }

    const query = await this.model
      .query()
      .paginate(
        Number(pagination?.page) || 1,
        Number(pagination?.perPage) || 5
      );

    return this.transformResult(query);
  }

  public async create(modelPayload) {
    try {
      const data = await this.model.create(modelPayload);
      return data.serialize();
    } catch (error) {
      return error;
    }
  }

  public async findById(id: number) {
    return await this.model.find(id);
  }

  public async findBy(id: any, field: string) {
    return await this.model.query().where(field, id)

  }

  public async update(id: number, modelPayload) {
    try {
      await this.model
        .query()
        .where("id", id)
        .update(modelPayload);
      const updatedModel = await this.model.find(id)
      return updatedModel;
    } catch (error) {
      return error
    }
  }

  public async delete(id: number) {
    try {
      const user = await this.model.query().where('id', id).delete()
      return user
    } catch (error) {
      return error
    }
  }

  protected async transformResult(query) {
    return {
      total: query.total,
      page: query.currentPage,
      perPage: query.perPage,
      data: query.all().map((d) => d.toJSON()),
    };
  }
}
