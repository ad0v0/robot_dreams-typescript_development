import dotenv from 'dotenv'
import { Dialect } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

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
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:', // runs in RAM
    logging: false,
  },
}
const db = new Sequelize({
  ...config[process.env.NODE_ENV || 'development'],
  models: [__dirname + '/../models'],
})

export default db