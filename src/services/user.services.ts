import mongoose from 'mongoose'
import { Response } from 'express'

import { userModel } from '~/models/model/user.model'
import { userType } from '~/types/users.types'
import { hashPassword } from '~/utils/hash-password'
import { signJWT } from '~/utils/jwt'
import { configEnv } from '~/contants/configENV'
import { sendMail } from '~/utils/send-mail'
import { refreshTokenModel } from '~/models/model/refresh-token'
import { randomToken } from '~/utils/random-token'
import { EmailVerifyToken } from '~/type'

export const userServices = {
  access_token: async ({ user_id, time }: { user_id: string; time: string | number }) =>
    await signJWT({
      payload: { user_id: user_id },
      privateKey: configEnv.PRIMARY_KEY,
      options: { expiresIn: time }
    }),
  refresh_token: async ({ user_id, exp }: { user_id: string; exp?: number }) => {
    if (exp) {
      return await signJWT({ payload: { user_id: user_id, exp }, privateKey: configEnv.PRIMARY_KEY_REFRESH_TOKEN })
    }
    return await signJWT({
      payload: { user_id: user_id },
      privateKey: configEnv.PRIMARY_KEY_REFRESH_TOKEN,
      options: { expiresIn: '10h' }
    })
  },

  register: async ({
    payload,
    response
  }: {
    payload: Pick<userType, 'name' | 'password' | 'email'>
    response: Response
  }) => {
    const _id = new mongoose.Types.ObjectId()
    const codeRandom = randomToken()
    await sendMail({ subject: 'Mã xác thực của bạn tại đây', object: codeRandom })
    const maxAge = 15 * 60 * 1000
    const expireTime = new Date(Date.now() + maxAge)
    const dataResponse = {
      ...payload,
      _id: _id,
      email_verify_token: codeRandom,
      password: hashPassword(payload.password)
    }
    await userModel.create(dataResponse)
    response.cookie('profile', dataResponse, { httpOnly: true, expires: expireTime })
    return {
      message: 'register successfully',
      data: {
        _id
      }
    }
  },

  checkEmailExist: async (email: string) => {
    const checkExist = await userModel.findOne({ email })
    return checkExist
  },

  EmailVerifyToken: async (profile: EmailVerifyToken) => {
    const [access_token, refresh_token] = await Promise.all([
      userServices.access_token({ user_id: profile._id.toString(), time: '1h' }),
      userServices.refresh_token({ user_id: profile._id.toString() })
    ])
    delete profile.email_verify_token
    await Promise.all([refreshTokenModel.create({ refresh_token }), userModel.create(profile)])
    return {
      data: {
        access_token,
        refresh_token
      },
      message: 'verify_email_token successfully'
    }
  },
  login: async (email: string) => {
    const res = (await userModel
      .findOne({ email })
      .select('-password -verify -email_verify_token -forgot_password_token')) as userType
    const [access_token, refresh_token] = await Promise.all([
      userServices.access_token({ user_id: res._id as string, time: '1h' }),
      userServices.refresh_token({ user_id: res._id as string })
    ])
    await refreshTokenModel.create({ user_id: res._id, refresh_token })
    return {
      message: 'login successfully',
      data: {
        access_token: access_token,
        refresh_token: refresh_token,
        user: res
      }
    }
  },
  refreshToken: async ({ user_id, exp, token }: { user_id: string; exp: number; token: string }) => {
    const [access_token, refresh_token] = await Promise.all([
      userServices.access_token({ user_id: user_id, time: '1h' }),
      userServices.refresh_token({ user_id: user_id, exp: exp }),
      await refreshTokenModel.deleteOne({ refresh_token: token })
    ])
    await refreshTokenModel.create({ user_id: user_id, refresh_token: refresh_token })
    return {
      message: 'refresh_token successfully',
      data: {
        access_token,
        refresh_token
      }
    }
  },
  logout: async ({ user_id }: { user_id: string }) => {
    await refreshTokenModel.deleteMany({ user_id })
    return {
      message: 'logout successfully',
      data: {}
    }
  },
  forgotPassword: async ({ _id }: { _id: string }) => {
    const token = randomToken()
    const [res] = await Promise.all([
      userModel
        .findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(_id) },
          {
            $set: {
              forgot_password_token: token
            }
          },
          {
            new: true
          }
        )
        .select('_id'),
      sendMail({ subject: 'Mã xác thực của bạn tại đây', object: token })
    ])
    return {
      message: 'check email để xác nhận',
      data: res
    }
  },

  verifyForgotPassword: async ({ _id }: { _id: string }) => {
    const res = await userModel
      .findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(_id) },
        {
          $set: {
            forgot_password_token: ''
          }
        },
        {
          new: true
        }
      )
      .select('_id')
    return {
      message: 'forgotPassword_verify_token successfully',
      data: res
    }
  },
  resetPassword: async ({ user_id, password }: { user_id: string; password: string }) => {
    const res = await userModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(password)
        }
      },
      {
        new: true
      }
    )
    return {
      message: 'reset password successfully',
      data: {}
    }
  },
  getMe: async (user_id: string) => {
    const result = await userModel
      .findOne({ _id: new mongoose.Types.ObjectId(user_id) })
      .select('-password -forgot_password_token')
    return {
      message: 'get me successfully',
      data: result
    }
  },
  updateMe: async ({ user_id, payload }: { user_id: string; payload: userType }) => {
    const response = await userModel
      .findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(user_id)
        },
        {
          $set: payload
        },
        {
          new: true
        }
      )
      .select('-email_verify_token -forgot_password_token  -password')
    return {
      message: 'update me successfully',
      data: response
    }
  },
  changePassword: async ({ user_id, payload }: { user_id: string; payload: userType }) => {
    const res = await userModel
      .findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(user_id)
        },
        {
          $set: {
            password: hashPassword(payload.new_password as string)
          }
        },
        {
          new: true
        }
      )
      .select(' -forgot_password_token  -password')
    return {
      message: 'changePassword successfully',
      data: res
    }
  }
}
