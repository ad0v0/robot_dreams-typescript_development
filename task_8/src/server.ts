import morgan from 'morgan'
import cors from 'cors'
import express, { Request, Response } from 'express'
import { ZodError, ZodIssue } from 'zod'
import 'reflect-metadata'

import db from './config/database'
import taskRoutes from './routes/task.routes'
import AppError from './error'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

async function main() {
  await db.sync({ alter: true })
  console.log('DB synced')
}

main()

app.use('/tasks', taskRoutes)

app.use((error: unknown, req: Request, res: Response) => {
  if (error instanceof AppError) {
    console.error('AppError:', error.message)
    return res.status(error.statusCode).json({ error: error.message })
  }

  if (error instanceof ZodError) {
    const issues: ZodIssue[] = error.issues
    const message = issues.map((issue: ZodIssue) => issue.message ?? 'Invalid input').join('; ')

    console.error('ZodError:', message)

    return res.status(400).json({ error: `Invalid input: ${message}` })
  }

  if (error instanceof Error) {
    console.error('Error:', error.stack ?? error.message)
    return res.status(500).json({ error: 'Internal Server Error' })
  }

  console.error('Unknown error:', error)
  return res.status(500).json({ error: 'Internal Server Error' })
})

app.use((error: AppError, req: Request, res: Response) => {
  res.status(error.statusCode).send(error.message)
})

export default app
