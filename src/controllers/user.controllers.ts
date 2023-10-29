import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { userServices } from '~/services/user.services'
import { EmailTokenTypes } from '~/type'

export const userControllers = {
  register: async (
    req: Request,
    res: Response
  ) => {
    try {
      const response = await userServices.register(req.body)
      return res.json(response)
    } catch (error) {
      console.log(error)
    }
  },
  EmailVerifyToken: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.email_verify_token as EmailTokenTypes
      const result = await userServices.EmailVerifyToken(user_id);
      return res.json(result)
    } catch (e) {
      console.log(e)
    }
  }
}
