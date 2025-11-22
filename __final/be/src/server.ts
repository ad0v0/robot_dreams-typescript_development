import morgan from 'morgan'
import cors from 'cors'
import express, { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
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

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

app.get('/favicon.ico', (req, res) => res.status(204).end())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!')
})

app.use('/tasks', taskRoutes)

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    console.error('AppError:', error.message)
    return res.status(error.statusCode).json({ error: error.message })
  }

  if (error instanceof ZodError) {
    const issues = error.issues
    const message = issues.map((issue) => issue.message ?? 'Invalid input').join('; ')
    console.error('ZodError:', message)
    return res.status(400).json({ error: `Invalid input: ${message}` })
  }

  console.error('Unhandled error:', error)
  return res.status(500).json({
    error: error instanceof Error ? error.message : 'Internal Server Error'
  })
})

/* eslint-disable @typescript-eslint/no-unused-vars */
// app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
//   if (error instanceof AppError) {
//     console.error('AppError:', error.message)
//     return res.status(error.statusCode).json({ error: error.message })
//   }
//
//   if (error instanceof ZodError) {
//     const issues = error.issues
//     const message = issues.map((issue) => issue.message ?? 'Invalid input').join('; ')
//
//     console.error('ZodError:', message)
//
//     return res.status(400).json({ error: `Invalid input: ${message}` })
//   }
//
//   return res.status(500).json({
//     error: error instanceof Error ? error.message : 'Internal Server Error'
//   })
// })
//
// app.use((error: AppError, req: Request, res: Response) => {
//   res.status(error.statusCode).send(error.message)
// })


export default app
