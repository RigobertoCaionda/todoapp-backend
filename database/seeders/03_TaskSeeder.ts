import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Task from 'App/Models/Task'

export default class extends BaseSeeder {

  public async run() {
    await Task.create({
      descricao: "Tarefa de Teste",
      priorityId: 1,
      userId: 1,
    });
  }
}
