import { checkSchema } from 'express-validator/src/middlewares/schema'

import { errorWithStatus } from '~/contants/errorMessage'
import { userServices } from '~/services/user.services'
import { validate } from '~/utils/validation'
import { configEnv } from '~/contants/configENV'
import { verifyJWT } from '~/utils/jwt'
import { userModel } from '~/models/model/user.model'
import { hashPassword } from '~/utils/hashPassword'
import { check } from 'express-validator'

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
          errorMessage: 'Password should be at least 5 chars'
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
    ['params']
  )
)

export const validationLogin = validate(
  checkSchema(
    {
      email: {
        isEmpty: false,
        isEmail: true,
        errorMessage: 'email phải đúng định dạng',
        custom: {
          options: async (value, { req }) => {
            const checkEmail = await userModel.findOne({ email: req.body.email })
            if (!checkEmail) {
              throw new errorWithStatus({ message: 'email của bạn không tồn tại', status: 401 })
            } else {
              if (checkEmail.password !== hashPassword(req.body.password)) {
                throw new errorWithStatus({ message: 'bạn nhập mật khẩu  không đúng', status: 401 })
              }
              return true
            }
          }
        }
      },
      password: {
        isEmpty: false,
        isLength: {
          options: { min: 5, max: 25 },
          errorMessage: 'Password should be at least 5 chars'
        }
      }
    },
    ['body']
  )
)

export const validationRefreshToken = validate(
  checkSchema(
    {
      refresh_token: {
        custom: {
          options: async (value, { req }) => {
            try {
              const verifyRefreshToken = await verifyJWT({
                privateKey: configEnv.PRIMARY_KEY_REFRESH_TOKEN,
                payload: req.body.refresh_token
              })
              req.refresh_token = verifyRefreshToken
              return true
            } catch (error) {
              throw new errorWithStatus({
                message: 'refresh_token không đúng hoặc hết hạn',
                status: 401
              })
            }
          }
        }
      }
    },
    ['body']
  )
)

export const validationForgotPassword = validate(
  checkSchema(
    {
      email: {
        isEmpty: false,
        isEmail: true,
        errorMessage: 'email phải đúng định dạng',
        custom: {
          options: async (value, { req }) => {
            const checkEmailExist = await userServices.checkEmailExist(req.body.email)
            if (!checkEmailExist) {
              throw new Error('email bạn nhập không đúng')
            }
            req.forgotPassword = checkEmailExist
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const validationForgotToken = validate(
  checkSchema(
    {
      forgot_password_token: {
        isEmpty: false,
        errorMessage: 'mã nhập không được để trống',
        custom: {
          options: async (value, { req }) => {
            const token = req.params
            const checkToken = await userModel.findOne({
              forgot_password_token: req.body.forgot_password_token,
              _id: token?.forgot_password_token
            })
            if (!checkToken) {
              throw new Error('mã bạn nhập không đúng')
            }
            req.verifyForgotPassword = checkToken
            return true
          }
        }
      }
    },
    ['body']
  )
)
export const validationResetPassword = validate(
  checkSchema(
    {
      password: {
        isEmpty: false,
        isLength: {
          options: { min: 5, max: 25 },
          errorMessage: 'Password should be at least 5 chars'
        }
      },
      confirm_password: {
        isEmpty: false,
        isLength: {
          options: { min: 5, max: 25 },
          errorMessage: 'Password should be at least 5 chars'
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new errorWithStatus({ message: 'mật khẩu bạn nhập lại không đúng', status: 402 })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const validateAccessToken = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value, { req }) => {
            const token = value?.split(' ')[1]
            try {
              const verify_token = await verifyJWT({ privateKey: configEnv.PRIMARY_KEY, payload: token })
              req.verify_access_token = verify_token
            } catch (err) {
              throw new errorWithStatus({ message: 'token không đúng hoặc hết hạn', status: 401 })
            }
          }
        }
      }
    },
    ['headers']
  )
)
export const validateDataUser = validate(
  checkSchema({
    name: {
      isEmpty: false,
      errorMessage: 'name không được để trống'
    },
    bio: {
      isEmpty: false,
      errorMessage: 'bio không được để trống'
    },
    website: {
      isEmpty: false,
      errorMessage: 'website không được để trống'
    },
    avatar: {
      isEmpty: false,
      errorMessage: 'avatar không được để trống'
    },
    cover_photo: {
      isEmpty: false,
      errorMessage: 'cover_photo không được để trống'
    }
  })
)
