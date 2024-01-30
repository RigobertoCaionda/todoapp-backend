import Route from "@ioc:Adonis/Core/Route";

Route.get("/tasks", "TasksController.index").middleware("auth");
