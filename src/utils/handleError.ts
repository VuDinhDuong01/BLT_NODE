import { Request, Response, NextFunction } from 'express'
import omit from 'lodash/omit'

import { HTTP_STATUS } from './http-status'

export const handleError = (err: any, req: Request, res: Response, next: NextFunction) => {

  if (err.status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(omit(err, ['status']))
  }
  return res.status(err.status || HTTP_STATUS.BAD_REQUEST).json(omit(err, ['status']))
}
