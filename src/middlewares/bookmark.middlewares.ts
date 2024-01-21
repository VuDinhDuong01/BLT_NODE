import { checkSchema } from 'express-validator'

import { validate } from '~/utils/validation'

export const validationBookmark = validate(
  checkSchema(
    {
      tweet_id: {
        isEmpty: false,
        errorMessage: 'tweet_id không được bỏ trống'
      },
      user_id: {
        isEmpty: false,
        errorMessage: 'Trường này không được bỏ trống'
      }
    },
    ['body']
  )
)
