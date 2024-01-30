import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('descricao').notNullable()
      table.integer('priority_id').unsigned().references('id').inTable('priorities')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.datetime('start_date').nullable()
      table.datetime('end_date').nullable()
      table.boolean('finished').defaultTo(0)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
