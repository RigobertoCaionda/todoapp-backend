import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Priority from './Priority';
import User from './User';

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public descricao: string;

  @column()
  public priorityId: number;

  @belongsTo(() => Priority)
  public priority: BelongsTo<typeof Priority>;

  @column()
  public userId: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @column()
  public startDate: DateTime;

  @column()
  public endDate: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
