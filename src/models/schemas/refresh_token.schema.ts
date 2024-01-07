import { Schema } from 'mongoose'
import { RefreshTokenType } from '~/types/users.types'

export const refreshTokenSchema = new Schema<RefreshTokenType>(
  {
    refresh_token: { type: String, default: '' },
    user_id: { type: String, default: '' },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
  },
  {
    collection: 'refresh_token',

  })

export default refreshTokenSchema
