import { userModel } from "~/models/model/user.model";
import { userType } from "~/types/users.types";
import { hashPassword } from "~/utils/hashPassword";
import { signJWT } from "~/utils/jwt";
import { configEnv } from "~/contants/configENV";

export const userServices = {
  access_token: async (user_id: string) => await signJWT({ payload: { user_id }, privateKey: configEnv.PRIMARY_KEY, options: { expiresIn: '1h' } }),
  refresh_token: async (user_id: string) => await signJWT({ payload: { user_id }, privateKey: configEnv.PRIMARY_KEY, options: { expiresIn: '10h' } }),
  register: async (payload: Pick<userType, 'name' | 'password' | 'email' | 'date_of_birth'>) => {
    const rs = await userModel.create({
      ...payload,
      password: hashPassword(payload.password)
    }) as userType

    const [access_token, refresh_token] = await Promise.all([userServices.access_token(rs._id as string), userServices.refresh_token(rs._id as string)])
    return {
      message: "register successfully",
      data: {
        access_token,
        refresh_token
      }
    }
  }
}