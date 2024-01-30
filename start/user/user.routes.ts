import Route from "@ioc:Adonis/Core/Route";

Route.get("/users", "UsersController.index").middleware("auth");
Route.post("/users", "UsersController.store");
Route.get("/users/:id", "UsersController.show").middleware("auth");
Route.patch("/users/:id", "UsersController.update").middleware("auth");
Route.delete("/users/:id", "UsersController.destroy").middleware("auth");
