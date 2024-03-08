import { Request, Response, NextFunction } from 'express'
import { unlink } from 'fs'

import { userServices } from '~/services/user.services'
import { EmailTokenTypes, EmailVerifyToken, forgotPasswordType, verify_access_token } from '~/type'
import { userType } from '~/types/users.types'

export const userControllers = {
  register: async (req: Request, res: Response) => {
    try {
      const response = await userServices.register({ payload: req.body, response: res })
      return res.json(response)
    } catch (error) {
      console.log(error)
    }
  },
  EmailVerifyToken: async (req: Request, res: Response) => {
    try {
      const profile = req.email_verify_token as userType
      const result = await userServices.EmailVerifyToken(profile)
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
  logout: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.verify_refresh_token as EmailTokenTypes
      const result = await userServices.logout({ user_id: user_id })
      return res.json(result)
    } catch (err) {
      console.log(err)
    }
  },
  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { _id } = req.forgotPassword as forgotPasswordType
      const result = await userServices.forgotPassword({ _id: _id.toString() })
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
  },
  getMe: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.params
      const response = await userServices.getMe(user_id)
      return res.json(response)
    } catch (err) {
      console.log(err)
    }
  },
  updateMe: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.verify_access_token as verify_access_token
      const response = await userServices.updateMe({ user_id: user_id, payload: req.body })
      return res.json(response)
    } catch (err) {
      console.log(err)
    }
  },
  changePassword: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.verify_access_token as verify_access_token
      const response = await userServices.changePassword({ user_id: user_id, payload: req.body })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },

  getTweetUser: async (req: Request, res: Response) => {
    const { user_id } = req.params
    const { title, limit, page } = req.query
    try {
      const result = await userServices.getTweetUser({
        user_id: user_id,
        title: title as string,
        limit: limit as string,
        page: page as string
      })
      return res.json(result)
    } catch (error: unknown) {
      console.log(error)
    }
  },
  getSearchUser: async (req: Request, res: Response) => {
    try {
      const { user_search } = req.query
      const result = await userServices.searchUser({ user_search: user_search as string })
      return res.json(result)
    } catch (error: unknown) {
      console.log(error)
    }
  }
}
