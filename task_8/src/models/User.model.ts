import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'
import TaskModel from './Task.model'

@Table({ tableName: 'users' })
export default class UserModel extends Model<UserModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare name: string

  @Column({
    type: DataType.STRING(254),
    allowNull: false,
    unique: true,
  })
  declare email: string

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  declare createdAt: Date

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  declare updatedAt: Date

  @HasMany(() => TaskModel, 'assigneeId')
  declare tasks?: TaskModel[]
}
