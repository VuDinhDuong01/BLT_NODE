import express from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'

import { errorWithStatus, errorWithStatus422 } from '~/contants/errorMessage'
import { HTTP_STATUS } from './http-status'

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const errorObject = errors.mapped()
    const ErrorMessage = new errorWithStatus422({ error: {}, message: 'lỗi' })

    for (const key in errorObject) {
      const { msg } = errorObject[key]
      if (msg instanceof errorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      ErrorMessage.error[key] = msg
    }
    next(ErrorMessage)
  }
}
