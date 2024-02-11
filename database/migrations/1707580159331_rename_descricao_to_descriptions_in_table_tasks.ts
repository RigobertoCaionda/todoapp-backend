import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
     table.renameColumn('descricao', 'description')
    })
  }

  public async down () {
     this.schema.alterTable(this.tableName, (table) => {
       table.renameColumn("description", "descricao");
     });
  }
}
