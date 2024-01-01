import { Request } from 'express'
import { ObjectId } from 'mongoose'
interface RequestWithCookies extends Request {
  cookies: { [key: string]: any }
}
interface EmailTokenTypes {
  user_id: string
  exp: number
  iat: number
  code?: string
}
interface EmailVerifyToken {
  name: string
  password: string
  email: string
  _id: string
  email_verify_token?: string
}

interface forgotPasswordType {
  _id: ObjectId
  email: string
  name: string
}
interface verify_access_token {
  user_id: string
  iat: number
  exp: number
}
declare module 'express' {
  interface Request {
    email_verify_token?: EmailVerifyToken
    refresh_token?: EmailTokenTypes
    forgotPassword?: forgotPasswordType
    verifyForgotPassword?: verifyForgotPassword
    verify_access_token?: verify_access_token
  }
}

interface FolloweType {
  follower_id: ObjectId
  followered_id: ObjectId
  created_at: Date
  updated_at: Date
}
