import { Optional } from "sequelize"
import {
  AllowNull,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript"

interface UserAttributes {
  id: number
  name: string
  email: string
  active?: boolean
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

@Table({})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string
  @AllowNull(false)
  @Column(DataType.STRING)
  declare email: string
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare active: boolean
  @Column(DataType.DATE)
  declare lastLoginAt: Date
  @HasMany(() => Post)
  posts!: Post[]
}