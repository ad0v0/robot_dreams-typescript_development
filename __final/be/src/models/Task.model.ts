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
import type { Status, Priority } from '../types/task.types'

interface TaskCreationAttributes {
  title: string
  description?: string | null
  status?: Status
  priority?: Priority
  deadline: Date | null
  assigneeId?: string | null
}

@Table({ tableName: 'tasks' })
export default class TaskModel extends Model<TaskModel, TaskCreationAttributes> {
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
    type: DataType.ENUM('todo', 'in_progress', 'review', 'done'),
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

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: () => new Date(Date.now() + 7*24*60*60*1000) })
  declare deadline: Date

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
