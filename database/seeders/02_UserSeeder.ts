import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {

  public async run() {
    const existingUser = await User.findBy("email", "rigoberto@gmail.com");
    if (!existingUser) {
      await User.create({
        email: "rigoberto@gmail.com",
        age: 26,
        password: "123",
        nome: "Rigoberto Caionda",
      });
    }
  }
}
