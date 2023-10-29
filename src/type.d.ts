import { Request } from "express"

interface EmailTokenTypes {
  user_id: string,
  exp: number,
  iat:number
}

declare module 'express' {
  interface Request {
    email_verify_token?: EmailTokenTypes
    refresh_token?: EmailTokenTypes 
  }
}

