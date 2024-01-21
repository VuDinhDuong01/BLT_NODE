import { checkSchema } from 'express-validator'
import { TweetAudience, TweetType } from '~/types/tweet.types'
import { getKeyFromObject } from '~/utils/common'

import { validate } from '~/utils/validation'

const typeTweet = getKeyFromObject(TweetType)
const audienceTweet = getKeyFromObject(TweetAudience)
export const validationTweet = validate(
  checkSchema(
    {
      hashtags: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            if (!value?.every((item: any) => typeof item === 'string')) {
              throw new Error('Dữ liệu không hợp lệ')
            }
            return true
          }
        }
      },
      mentions: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            if (!value?.every((item: any) => typeof item === 'string')) {
              throw new Error('Dữ liệu không hợp lệ')
            }
            return true
          }
        }
      },
      type: {
        isIn: {
          options: [typeTweet],
          errorMessage: 'Dữ liệu không hợp lệ'
        }
      },
      audience: {
        isIn: {
          options: [audienceTweet],
          errorMessage: 'Dữ liệu không hợp lệ'
        }
      },

      user_id: {
        isEmpty: false,
        errorMessage: 'Trường này không được bỏ trống'
      }
    },
    ['body']
  )
)
