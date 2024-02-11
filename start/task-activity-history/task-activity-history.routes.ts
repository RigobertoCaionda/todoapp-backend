import Route from "@ioc:Adonis/Core/Route";

Route.get("/task-activity-history", "TaskActivityHistoriesController.index").middleware("auth");
Route.post(
  "/task-activity-history",
  "TaskActivityHistoriesController.store"
).middleware("auth");
