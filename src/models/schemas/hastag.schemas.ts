import { Schema } from 'mongoose'
import { HashTagsType } from '~/types/hashtag.types'

const hashTagsSchema = new Schema<HashTagsType>(
  {
    name: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: 'Hashtags'
  }
)

export default hashTagsSchema
