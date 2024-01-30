import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Priority from "App/Models/Priority";

export default class extends BaseSeeder {
  public async run() {
    await Priority.create({
     name: 'Alta'
    });
  }
}
