import { Request } from "express"

interface EmailTokenTypes {
  user_id: string,
}
declare module 'express' {
  interface Request {
    email_verify_token?: EmailTokenTypes
  }
}

