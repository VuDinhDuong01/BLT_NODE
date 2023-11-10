import mongoose from 'mongoose'

import { userModel } from '~/models/model/user.model'
import { userType } from '~/types/users.types'
import { hashPassword } from '~/utils/hashPassword'
import { signJWT } from '~/utils/jwt'
import { configEnv } from '~/contants/configENV'
import { sendMail } from '~/utils/sendMail'
import { VerifyEmail } from '~/models/schemas/user.schemas'
import { refreshTokenModel } from '~/models/model/refresh_token.model'
import { randomToken } from '~/utils/radomToken'

export const userServices = {
  access_token: async ({ user_id, time }: { user_id: string; time: string }) =>
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

  register: async (payload: Pick<userType, 'name' | 'password' | 'email' | 'date_of_birth'>) => {
    const _id = new mongoose.Types.ObjectId()

    const [access_token, refresh_token] = await Promise.all([
      userServices.access_token({ user_id: _id.toString(), time: '1h' }),
      userServices.refresh_token({ user_id: _id.toString() })
    ])

    await userModel.create({
      ...payload,
      _id: _id,
      email_verify_token: randomToken(),
      password: hashPassword(payload.password)
    })
    await refreshTokenModel.create({ refresh_token })
    // giửi gmail xác thực
    await sendMail({ subject: 'Mã xác thực của bạn tại đây', object: randomToken() })
    return {
      message: 'register successfully',
      data: {
        _id,
        access_token: access_token,
        refresh_token: refresh_token
      }
    }
  },

  checkEmailExist: async (email: string) => {
    const checkExist = await userModel.findOne({ email })
    return checkExist
  },

  EmailVerifyToken: async (user_id: string) => {
    await userModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(user_id) },
      {
        $set: {
          verify: VerifyEmail.Authenticated,
          email_verify_token: ''
        }
      },
      {
        new: true
      }
    )
    return {
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
    await refreshTokenModel.create({ refresh_token })
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
    await refreshTokenModel.create({ refresh_token })
    return {
      message: 'refresh_token successfully',
      data: {
        access_token,
        refresh_token
      }
    }
  },
  logout: async ({ refresh_token }: { refresh_token: string }) => {
    const response = await refreshTokenModel.deleteOne({
      refresh_token
    })
    return {
      message: "logout successfully"
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
      message: 'reset password successfully'
    }
  },
  getMe: async (user_id: string) => {
    const result = await userModel.findOne({ _id: new mongoose.Types.ObjectId(user_id) })
    return {
      message: 'get me successfully',
      data: result
    }
  },
  updateMe: async ({ user_id, payload }: { user_id: string, payload: userType }) => {
    const response = await userModel.findOneAndUpdate({
      _id: new mongoose.Types.ObjectId(user_id)
    }, {
      $set: {
        ...payload,
        name: payload.name,
        date_of_birth: payload.date_of_birth,
        bio: payload.bio,
        location: payload.location,
        website: payload.website,
        username: payload.username,
        avatar: payload.avatar,
        cover_photo: payload.cover_photo,
      }
    }, {
      new: true
    }).select("-email_verify_token -forgot_password_token -verify -password ")
    return {
      message: "update me successfully",
      data: response

    }
  }


}
