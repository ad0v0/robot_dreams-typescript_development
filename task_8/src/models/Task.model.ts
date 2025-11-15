import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'
import UserModel from './User.model'

export type Status = 'todo' | 'in_progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'

@Table({ tableName: 'tasks' })

export default class TaskModel extends Model<TaskModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string

  @Column({ type: DataType.STRING(300), allowNull: false })
  declare title: string

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description?: string | null

  @Column({
    type: DataType.ENUM('todo', 'in_progress', 'done'),
    allowNull: false,
    defaultValue: 'todo',
  })
  declare status: Status

  @Column({
    type: DataType.ENUM('low', 'medium', 'high'),
    allowNull: false,
    defaultValue: 'low',
  })
  declare priority: Priority

  @Column({ type: DataType.DATE, allowNull: true })
  declare deadline?: Date | null

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID, allowNull: true })
  declare assigneeId?: string | null

  @BelongsTo(() => UserModel, 'assigneeId')
  declare assignee?: UserModel

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  declare createdAt: Date

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  declare updatedAt: Date
}
