import Factory from "@ioc:Adonis/Lucid/Factory";
import TaskActivityHistory from "App/Models/TaskActivityHistory";
import Task from "App/Models/Task";
import Priority from "App/Models/Priority";
import User from "App/Models/User";

export const TaskActivityHistoryFactory = Factory.define(TaskActivityHistory, async ({ faker }) => {

  const priority = await Priority.create({
    name: faker.word.adjective()
  });

  const user = await User.create({
    age: faker.number.int({ min: 10, max: 80 }),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  });

  const task = await Task.create({
    description: faker.word.adjective(),
    priorityId: priority.id,
    userId: user.id
  });

  return {
    action: 'listar',
    taskId: task.id,
    userId: user.id
  };
}).build();
