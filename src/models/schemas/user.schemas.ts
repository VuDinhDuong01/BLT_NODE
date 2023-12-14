import { Schema } from 'mongoose'
import { userType } from '~/types/users.types'


export const userSchema = new Schema<userType>(
  {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    date_of_birth: { type: String, default: '' },
    password: { type: String, default: '' },
    forgot_password_token: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    username: { type: String, default: '' },
    avatar: { type: String, default: '' },
    cover_photo: { type: String, default: '' },
    roles:{
      type: [String],
      enum: ['user', 'admin', 'customer'],
      default: ['user'],
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }

  },
  {
    collection: 'users'
  })

export default userSchema
