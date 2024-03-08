export type userType = {
  _id?: string
  name: string
  password: string
  new_password?: string
  email: string
  date_of_birth: string
  email_verify_token?: string
  forgot_password_token?: string
  verify: number
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
  roles: string[]
  updated_at?: Date
  created_at?: Date
}

export interface RefreshTokenType {
  refresh_token: string
  _id?: string
  user_id: string
  updated_at?: Date
  created_at?: Date
}
