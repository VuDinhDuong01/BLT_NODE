import {   Schema} from 'mongoose'
import { userType } from '~/types/users.types'

enum VerifyEmail {
  NotAuthenticated, Authenticated,
}

export const userSchema = new Schema<userType>(
  {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    date_of_birth: { type: String, default:''},
    password: { type: String, default: '' },
    email_verify_token: { type: String, default: '' },
    forgot_password_token: { type: String, default: '' },
    verify: { type: Number, default: VerifyEmail.NotAuthenticated },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    username: { type: String, default: '' },
    avatar: { type: String, default: '' },
    cover_photo: { type: String, default: '' }
  },
  {
    collection: 'users'
  }

)

export default userSchema
