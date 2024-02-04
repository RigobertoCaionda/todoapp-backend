import Route from "@ioc:Adonis/Core/Route";

Route.get("/tasks", "TasksController.index").middleware("auth");
Route.get("/tasks/:id", "TasksController.show").middleware("auth");
Route.get("/task/user", "TasksController.getUserTasks").middleware("auth");
Route.get("/task/finished", "TasksController.getFinishedTasks").middleware("auth");
Route.get("/task/unfinished", "TasksController.getUnFinishedTasks").middleware(
  "auth"
);
Route.post("/tasks", "TasksController.store").middleware("auth");
Route.patch("/tasks/:id", "TasksController.update").middleware("auth");
Route.delete("/tasks/:id", "TasksController.delete").middleware("auth");
