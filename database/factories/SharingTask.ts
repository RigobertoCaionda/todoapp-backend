import Factory from "@ioc:Adonis/Lucid/Factory";
import Priority from "App/Models/Priority";
import SharingTask from "App/Models/SharingTask";
import Task from "App/Models/Task";
import User from "App/Models/User";

export const SharingTaskFactory = Factory.define(SharingTask, async ({ faker }) => {
  const priority = await Priority.create({
    name: faker.word.adjective(),
  });

  const user = await User.create({
    age: faker.number.int({ min: 20, max: 60 }),
    email: faker.internet.email(),
    nome: faker.person.fullName(),
    password: faker.internet.password(),
  });
  const task = await Task.create({
    descricao: faker.word.adjective(),
    priorityId: priority.id,
    userId: user.id
  });

  return {
    taskId: task.id,
    userId: user.id
  };
}).build();
