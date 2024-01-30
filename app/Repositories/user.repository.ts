import User from "App/Models/User";
import BaseRepository from "./base.repository";

export class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }
}
