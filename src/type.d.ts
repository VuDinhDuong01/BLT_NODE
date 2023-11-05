import { Request } from "express"
import { ObjectId } from "mongoose"

interface EmailTokenTypes {
  user_id: string,
  exp: number,
  iat:number
}

interface forgotPasswordType{
  _id: ObjectId ,
  email: string ,
  name:string 
}
interface verify_access_token{
  user_id:string ,
  iat:number,
  exp: number

}
declare module 'express' {
  interface Request {
    email_verify_token?: EmailTokenTypes
    refresh_token?: EmailTokenTypes 
    forgotPassword?:forgotPasswordType,
    verifyForgotPassword?:verifyForgotPassword,
    verify_access_token?:verify_access_token

  }
}

