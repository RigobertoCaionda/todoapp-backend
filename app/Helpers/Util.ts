import { IPagination } from "./contracts/pagination";

export class Util {
  public static transformPagination(pagination: IPagination) {
    return {
      orderType: pagination?.orderType,
      page: pagination?.page || 1,
      perPage: pagination?.perPage || 5,
      withPagination: this.parseBoolean(pagination.withPagination)
    };
  }

  public static parseBoolean(value) {
    return value == 'true' || value == true ? true : false
  }
}
