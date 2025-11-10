import { Router } from 'express'

import { getAllTasks, getTaskDetails, createTask, updateTaskById, deleteTaskById } from '../controllers/task.controller'

const router = Router()

router.get('/', getAllTasks)
router.get('/:id', getTaskDetails)
router.post('/', createTask)
router.put('/:id', updateTaskById)
router.delete('/:id', deleteTaskById)

export default router
