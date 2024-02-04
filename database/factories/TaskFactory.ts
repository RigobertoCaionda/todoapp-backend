import Factory from "@ioc:Adonis/Lucid/Factory";
import Priority from "App/Models/Priority";
import Task from "App/Models/Task";
import User from "App/Models/User";

export const TaskFactory = Factory.define(Task, async ({ faker }) => {
  const priority = await Priority.create(
    {
      name: faker.word.adjective(),
    }
  );
  const user = await User.create(
    {
      age: faker.number.int({ min: 20, max: 60 }),
      email: faker.internet.email(),
      nome: faker.person.fullName(),
      password: faker.internet.password()
    }
  );

  return {
    descricao: faker.lorem.words({ min: 1, max: 3 }),
    priorityId: priority.id,
    userId: user.id,
  };
}).build();
