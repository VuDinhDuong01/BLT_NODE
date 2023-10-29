import { Request, Response, NextFunction } from 'express'

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
  },
  login: async (req: Request, res: Response) => {

    try {
      const { email } = req.body
      const result = await userServices.login(email)
      return res.json(result)
    } catch (error) {
      console.log(error)
    }
  },
  refresh_token: async (req: Request, res: Response) => {
    try {
      const { user_id, exp } = req.refresh_token as EmailTokenTypes
      const { refresh_token } = req.body
      const result = await userServices.refreshToken({ user_id, exp, token: refresh_token })
      return res.json(result)
    } catch (err) {
      console.log(err)
    }
  }
}
