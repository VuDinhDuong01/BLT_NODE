import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { userServices } from '~/services/user.services'
import { userType } from '~/types/users.types'
export const userControllers = {
  register: async (
    req: Request<ParamsDictionary, any, Pick<userType, 'name' | 'password' | 'email' | 'date_of_birth'>>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await userServices.register(req.body)
      return res.json(response)
    } catch (error) {
      console.log(error)
    }
  },
  // EmailVerifyToken: async (req: Request<ParamsDictionary, any, Pick<userType, 'email_verify_token'>>, res: Response, next: NextFunction) => {
  //   try {

  //   } catch (e) {
  //     console.log(e)
  //   }
  // }
}
