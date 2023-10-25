export type userType = {
  _id?:string
  name: string,
  password: string,
  email: string,
  date_of_birth: string,
  email_verify_token?:string
  forgot_password_token?: string,
  verify?: number,
  bio?: string,
  location?: string,
  website?: string,
  username?: string
  avatar?: string,
  cover_photo?: string
}