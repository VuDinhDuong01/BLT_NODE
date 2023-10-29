import { checkSchema } from 'express-validator/src/middlewares/schema'

import { errorWithStatus } from '~/contants/errorMessage'
import { userServices } from '~/services/user.services'
import { validate } from '~/utils/validation'
import { configEnv } from '~/contants/configENV'
import { verifyJWT } from '~/utils/jwt'


export const validationRegister = validate(
  checkSchema(
    {
      name: {
        isEmpty: false,
        isLength: {
          options: { min: 1, max: 255 },
          errorMessage: 'username should be at least 8 chars'
        }
      },
      email: {
        isEmpty: false,
        isEmail: true,
        errorMessage: 'email phải đúng định dạng',
        custom: {
          options: async (value, { req }) => {
            const checkEmailExist = await userServices.checkEmailExist(req.body.email)
            if (checkEmailExist) {
              throw new Error('email đã tồn tại')
            }

            return true
          }
        }
      },
      password: {
        isEmpty: false,
        isLength: {
          options: { min: 5, max: 25 },
          errorMessage: 'Password should be at least 8 chars'
        }
      },
      date_of_birth: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          }
        },
        errorMessage: 'ngày tháng phải đúng định dạng'
      }
    },
    ['body']
  )
)

export const validationEmailVerifyToken = validate(
  checkSchema(
    {
      email_verify_token: {
        custom: {
          options: async (value, { req }) => {
            try {
              const token = req.params
              const verify_token = await verifyJWT({ privateKey: configEnv.PRIMARY_KEY, payload: token?.token })
              req.email_verify_token = verify_token
              return true
            } catch (err) {
              throw new errorWithStatus({ message: 'token đã hết hạn hoặc không đúng', status: 402 })
            }
          }
        }
      }
    },
    ['body']
  )
)
