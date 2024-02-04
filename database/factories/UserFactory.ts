import Factory from "@ioc:Adonis/Lucid/Factory";
import User from "App/Models/User";

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    age: faker.number.int({ min: 10, max: 100 }),
    email: faker.internet.email(),
    nome: faker.person.fullName(),
    password: faker.internet.password()
  };
}).build();
