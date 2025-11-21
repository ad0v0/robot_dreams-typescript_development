import dotenv from 'dotenv'
import { Dialect } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import UserModel from '../models/User.model'
import TaskModel from '../models/Task.model'

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
})

interface DBConfig {
  [key: string]: {
    username?: string
    password?: string
    database?: string
    host?: string
    dialect: Dialect
    storage?: string
    logging?: boolean
  }
}

const config: DBConfig = {
  development: {
    dialect: 'sqlite',
    storage: './dev.sqlite',
    logging: false,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
}

const env = process.env.NODE_ENV || 'development'
const cfg = config[env]

const sequelize = new Sequelize({
  ...cfg,
  models: [UserModel, TaskModel],
  logging: env === 'development' ? console.log : false,
})

export default sequelize
export { sequelize as db, UserModel, TaskModel }
