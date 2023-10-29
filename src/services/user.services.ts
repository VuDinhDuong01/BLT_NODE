/* eslint-disable no-unsafe-optional-chaining */
import mongoose from 'mongoose'

import { userModel } from '~/models/model/user.model'
import { userType } from '~/types/users.types'
import { hashPassword } from '~/utils/hashPassword'
import { signJWT } from '~/utils/jwt'
import { configEnv } from '~/contants/configENV'
import { sendMail } from '~/utils/sendMail'
import { VerifyEmail } from '~/models/schemas/user.schemas'

export const userServices = {
  access_token: async ({ user_id, time }: { user_id: string, time: string }) =>
    await signJWT({
      payload: { user_id: user_id },
      privateKey: configEnv.PRIMARY_KEY,
      options: { expiresIn: time }
    }),
  refresh_token: async (user_id: string) =>
    await signJWT({ payload: { user_id }, privateKey: configEnv.PRIMARY_KEY, options: { expiresIn: '10h' } }),

  register: async (payload: Pick<userType, 'name' | 'password' | 'email' | 'date_of_birth'>) => {
    const _id = new mongoose.Types.ObjectId()

    const [access_token, refresh_token, email_verify_token] = await Promise.all([
      userServices.access_token({ user_id: _id.toString(), time: '1h' }),
      userServices.refresh_token(_id.toString()),
      userServices.access_token({ user_id: _id.toString(), time: '1h' }),
    ])

    const response = await userModel.create({
      ...payload,
      _id: _id,
      email_verify_token,
      password: hashPassword(payload.password)
    })
    // giửi gmail xác thực
    const link = `${configEnv.URLFE}/email_verify_token/${email_verify_token}`
    await sendMail({ subject: 'Mã xác thực của bạn tại đây', object: email_verify_token, link })
    return {
      message: 'register successfully',
      data: {
        access_token,
        refresh_token,
      }
    }
  },

  checkEmailExist: async (email: string) => {
    const checkExist = await userModel.findOne({ email })
    return Boolean(checkExist)
  },

  EmailVerifyToken: async (user_id: string) => {
    await userModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(user_id) },
      {
        $set: {
          verify: VerifyEmail.Authenticated,
          email_verify_token: '',
        }
      },
      {
        new: true
      }
    )
    return {
      message: 'verify_email_token successfully'
    }
  }
}
