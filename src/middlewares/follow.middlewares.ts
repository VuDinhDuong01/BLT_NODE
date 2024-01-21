import { checkSchema } from 'express-validator'

import { validate } from '~/utils/validation'

export const validationFollow = validate(
  checkSchema(
    {
      follower_id: {
        isEmpty: false,
        errorMessage: ' không được bỏ trống'
      },
      following_id: {
        isEmpty: false,
        errorMessage: 'không được bỏ trống'
      }
    },
    ['body']
  )
)
