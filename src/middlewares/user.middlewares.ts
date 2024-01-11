import { checkSchema } from 'express-validator/src/middlewares/schema'

import { errorWithStatus, errorWithStatus422 } from '~/contants/errorMessage'
import { userServices } from '~/services/user.services'
import { validate } from '~/utils/validation'
import { configEnv } from '~/contants/configENV'
import { verifyJWT } from '~/utils/jwt'
import { userModel } from '~/models/model/user.model'
import { hashPassword } from '~/utils/hash-password'
import { RequestWithCookies } from '~/type'
import { errorMonitor } from 'events'

export const validationRegister = validate(
  checkSchema(
    {
      name: {
        isEmpty: false,
        isLength: {
          options: { min: 1, max: 255 },
          errorMessage: 'Họ tên nhập chưa đúng định dạng'
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
          options: async (_, { req }) => {
            const { code } = req.body
            const profileCookie = (req as RequestWithCookies).cookies.profile
            if (profileCookie !== undefined) {
              if (code.toString() !== profileCookie.email_verify_token) {
                throw new Error('Mã xác thực không đúng')
              } else {
                req.email_verify_token = profileCookie
                return true
              }
            } else {
              throw new Error('Mã xác thực đã hết hiệu lực')
            }
          }
        }
      }
    },
    ['body']
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
              throw new Error('email của bạn không tồn tại')
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
        },
        custom: {
          options: async (value, { req }) => {
            const checkEmail = await userModel.findOne({ email: req.body.email })
            if (checkEmail?.password !== hashPassword(req.body.password)) {
              throw new Error('bạn nhập mật khẩu không đúng')
            }
            return true
          }
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
              _id: token?.user_id
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
              throw new errorWithStatus({ message: 'Tokens expire', status: 401 })
            }
          }
        }
      }
    },
    ['headers']
  )
)
export const validateRefreshToken = validate(
  checkSchema(
    {
      refresh_token: {
        isEmpty: false,
        custom: {
          options: async (value, { req }) => {
            try {
              const verify_refresh_token = await verifyJWT({
                privateKey: configEnv.PRIMARY_KEY_REFRESH_TOKEN,
                payload: req.body.refresh_token
              })
              req.verify_refresh_token = verify_refresh_token
            } catch (err) {
              throw new errorWithStatus({ message: 'refresh_token expires', status: 401 })
            }
          }
        }
      }
    },
    ['body']
  )
)
export const validateDataUser = validate(
  checkSchema(
    {
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
    },
    ['body']
  )
)
export const validateChangePassword = validate(
  checkSchema(
    {
      password: {
        isEmpty: false,
        errorMessage: 'name không được để trống',
        custom: {
          options: async (value, { req }) => {
            const checkSamePassword = await userModel.findOne({ password: hashPassword(req.body.password) })
            if (!checkSamePassword) {
              throw new Error('Mật khẩu bạn nhập không đúng')
            }
            return true
          }
        }
      },
      new_password: {
        isEmpty: false,
        errorMessage: 'Mật khẩu mới không được bỏ trống',
      }
    },
    ['body']
  )
)
