import { checkSchema } from 'express-validator'
import mongoose from 'mongoose'
import { tweetModel } from '~/models/model/tweet.model'
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
            if (value.length > 0 && !value?.every((item: any) => typeof item === 'string')) {
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
            if (value.length > 0 && !value?.every((item: any) => typeof item === 'string')) {
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

export const validationTweetId = validate(
  checkSchema(
    {
      tweet_id: {
        custom: {
          options: async (value, { req }) => {
            const tweet = await tweetModel.findOne({ _id: new mongoose.Types.ObjectId(value) })
            if (!tweet) {
              throw new Error('tweet không tồn tại')
            }
            return true
          }
        }
      }
    },
    ['body', 'params']
  )
)
