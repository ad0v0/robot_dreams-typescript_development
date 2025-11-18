import morgan from 'morgan'
import cors from 'cors'
import express, { Request, Response } from 'express'

import taskRoutes from './routes/task.routes'
import AppError from './error'

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!')
})

app.use('/tasks', taskRoutes)

app.use((error: unknown, req: Request, res: Response) => {
  if (error instanceof AppError) {
    console.error('AppError:', error.message)
    return res.status(error.statusCode).json({ error: error.message })
  }

  if (error instanceof Error) {
    console.error('Error:', error.message)
    return res.status(500).json({ error: error.message })
  }

  console.error('Unknown Error:', error)
  return res.status(500).json({ error: 'Internal Server Error' })
})

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
  })
}

export default app
