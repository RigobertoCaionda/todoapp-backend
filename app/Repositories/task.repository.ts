import Task from "App/Models/Task";
import BaseRepository from "./base.repository";

export class TaskRepository extends BaseRepository {
  constructor() {
    super(Task)
  }
}
