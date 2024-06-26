import mongoose, { ObjectId, Schema } from 'mongoose'

import { TweetAudience } from '~/types/tweet.types'

const idType = mongoose.Types.ObjectId

export interface Tweets {
  _id?: ObjectId
  content?: string
  hashtags?: ObjectId[]
  mentions?: ObjectId[]
  medias?: string[]
  user_id?: ObjectId
  audience?: TweetAudience
  guest_views?: number
  user_views?: number
  updated_at?: Date
  created_at?: Date
  medias_share?: string[]
  content_share?: string
  check_share?: boolean
  avatar_share?: string
  username_share?: string
  postId?: string
}
export const tweetSchema = new Schema<Tweets>(
  {
    content: { type: String, default: '' }, // nội dung
    user_id: { type: idType, default: '' },
    hashtags: { type: [idType], default: [] }, // hash tags
    mentions: { type: [idType], default: [] }, // nhắc tên ái trong bài post
    medias: { type: [String], default: [] },
    audience: { type: Number, default: TweetAudience.Everyone }, // post công khai hay là dữ kín
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
    user_views: { type: Number, default: 0 }, // views khi có người đăng nhập
    guest_views: { type: Number, default: 0 }, // views khi k có người đăng nhập,
    medias_share: { type: [String], default: [] },
    content_share: { type: String, default: '' },
    check_share: { type: Boolean, default: false },
    avatar_share: { type: String, default: '' },
    username_share: { type: String, default: '' },
    postId: { type: String , default: '' }
  },
  {
    collection: 'tweet'
  }
)

export default tweetSchema
