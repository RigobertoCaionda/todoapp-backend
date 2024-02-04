import Factory from "@ioc:Adonis/Lucid/Factory";
import Priority from "App/Models/Priority";

export const PriorityFactory = Factory.define(Priority, ({ faker }) => {
  return {
    name: faker.word.adjective()
  };
}).build();
