import { BaseModel } from "@ioc:Adonis/Lucid/Orm";
import { IPagination } from "App/Helpers/contracts/pagination";
export default abstract class BaseRepository {
  constructor(private model: typeof BaseModel) {}

  public async findAll(
    pagination: IPagination,
    relationships?: string[],
    filters?: Record<string, any>
  ) {
    let query = this.model.query(); // Primeiro busca o registro e depois faz paginacao e o relacionamento

    if (relationships && relationships.length > 0) {
      for (let relation of relationships) {
        query = (query as any).preload(relation);
      }
    }

    if (filters) {
      for (const [field, value] of Object.entries(filters)) {
        query = query.where(field, value);
      }
    }
    if (!pagination.withPagination) {
      const data = await query;
      return data.map((item) => item.serialize());
    }

    const result = await query.paginate(
      Number(pagination?.page) || 1,
      Number(pagination?.perPage) || 5
    );

    return this.transformResult(result);
  }

  public async create(modelPayload) {
    try {
      const data = await this.model.create(modelPayload);
      return data.serialize();
    } catch (error) {
      return error;
    }
  }

  public async findById(id: number, relationships?: string[]) {
    const query = this.model.query().where("id", id);
    if (relationships && relationships.length > 0) {
      for (let relation of relationships) {
        (query as any).preload(relation);
      }
    }
    const data = await query;
    return data[0];
  }

  public async findBy(value: any, field: string, relationships?: string[]) {
    const query = this.model.query().where(field, value);
    if (relationships && relationships.length > 0) {
      for (let relation of relationships) {
        (query as any).preload(relation);
      }
    }
    return await query;
  }

  public async update(id: number, modelPayload) {
    try {
      await this.model.query().where("id", id).update(modelPayload);
      const updatedModel = await this.model.find(id);
      return updatedModel;
    } catch (error) {
      return error;
    }
  }

  public async delete(id: number) {
    try {
      const user = await this.model.query().where("id", id).delete();
      return user;
    } catch (error) {
      return error;
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
