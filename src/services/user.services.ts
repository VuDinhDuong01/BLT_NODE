import mongoose from 'mongoose'

import { userModel } from '~/models/model/user.model'
import { userType } from '~/types/users.types'
import { hashPassword } from '~/utils/hashPassword'
import { signJWT } from '~/utils/jwt'
import { configEnv } from '~/contants/configENV'
import { sendMail } from '~/utils/sendMail'


export const userServices = {

  access_token: async (user_id?: string, numberRandom?: number) =>
    await signJWT({ payload: { user_id: user_id, numberRandom }, privateKey: configEnv.PRIMARY_KEY, options: { expiresIn: '1h' } }),
  refresh_token: async (user_id: string) =>
    await signJWT({ payload: { user_id }, privateKey: configEnv.PRIMARY_KEY, options: { expiresIn: '10h' } }),

  register: async (payload: Pick<userType, 'name' | 'password' | 'email' | 'date_of_birth'>) => {
    const _id = new mongoose.Types.ObjectId
    const [access_token, refresh_token] = await Promise.all([
      userServices.access_token(_id.toString()),
      userServices.refresh_token(_id.toString())
    ])

    const radomNumber = Math.floor(Math.random() * (999999 - 100000) + 1) + 100000
    const randomTokenVerifyEmail = await userServices.access_token(_id.toString(), radomNumber)

    const rs = (await userModel.create({
      ...payload,
      _id: _id,
      email_verify_token: randomTokenVerifyEmail,
      password: hashPassword(payload.password)
    })) as userType

    // giửi gmail xác thực


    await sendMail({ subject: "Mã xác thực của bạn tại đây", object: radomNumber.toString() })

    return {
      message: 'register successfully',
      data: {
        access_token,
        refresh_token
      }
    }
  },

  checkEmailExist: async (email: string) => {
    const checkExist = await userModel.findOne({ email })
    return Boolean(checkExist)
  },

  EmailVerifyToken: async () => {
    const response = await userModel.findOneAndUpdate()
  }

}
