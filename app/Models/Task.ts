import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Priority from './Priority';
import User from './User';
import SharingTask from './SharingTask';

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public description: string;

  @column()
  public priorityId: number;

  @column()
  public finished: boolean;

  @belongsTo(() => Priority)
  public priority: BelongsTo<typeof Priority>;

  @column()
  public userId: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @hasMany(() => SharingTask)
  public sharedTasks: HasMany<typeof SharingTask>;

  @column()
  public startDate: DateTime;

  @column()
  public endDate: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
