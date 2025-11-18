import { Router } from 'express'

import { validateBody, validateQuery } from '../middleware/validate.middleware'
import { taskBodySchema, taskQuerySchema } from '../schemas/task.schema'

import { getAllTasks, getTaskDetails, createTask, updateTaskById, deleteTaskById } from '../controllers/task.controller'

const router = Router()

router.get('/', validateQuery(taskQuerySchema), getAllTasks)
router.get('/:id', getTaskDetails)
router.post('/', validateBody(taskBodySchema), createTask)
router.put('/:id', validateBody(taskBodySchema.partial()), updateTaskById)
router.delete('/:id', deleteTaskById)

export default router
