import { Request, Response, NextFunction } from 'express'
import { z, ZodTypeAny } from 'zod'
import AppError from '../error'

declare module 'express-serve-static-core' {
  interface Request {
    validatedBody?: unknown
    validatedQuery?: unknown
  }
}

function handleError(error: unknown, next: NextFunction) {
  if (error instanceof z.ZodError) {
    const message = error.issues.map(i => i.message).join('; ')
    return next(new AppError(message, 400))
  }
  return next(error)
}

export const validateBody = <T extends ZodTypeAny>(schema: T) => (req: Request, _res: Response, next: NextFunction) => {
  try {
    req.validatedBody = schema.parse(req.body)
    next()
  } catch (err) {
    handleError(err, next)
  }
}

export const validateQuery = <T extends ZodTypeAny>(schema: T) => (req: Request, _res: Response, next: NextFunction) => {
  try {
    req.validatedQuery = schema.parse(req.query)
    next()
  } catch (err) {
    handleError(err, next)
  }
}
