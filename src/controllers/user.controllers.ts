import { Request, Response, NextFunction } from 'express'

import { userServices } from '~/services/user.services'
import { EmailTokenTypes, forgotPasswordType } from '~/type'

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
  },
  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { _id } = req.forgotPassword as forgotPasswordType
      const result = await userServices.forgotPassword({ _id: _id.toString() });
      return res.json(result)
    } catch (error) {
      console.log(error)
    }
  },
  verifyForgotPassword: async (req: Request, res: Response) => {
    try {

      const { _id } = req.verifyForgotPassword as forgotPasswordType
      const result = await userServices.verifyForgotPassword({ _id: _id.toString() })
      return res.json(result)
    } catch (error) {
      console.log(error)
    }
  },
  resetPassword: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.params
      const result = await userServices.resetPassword({ user_id, password: req.body.password })
      return res.json(result)
    } catch (error) {
      console.log(error)
    }
  }
}
