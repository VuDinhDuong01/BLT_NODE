import { Schema } from 'mongoose'

import { Tweet, TweetAudience, TweetType } from '~/types/tweet.types'

export const tweetSchema = new Schema<Tweet>(
  {
    content: { type: String, default: '' }, // nội dung
    user_id: { type: String, default: '' },
    hashtags: { type: [String], default: [] }, // hash tags
    mentions: { type: [String], default: [] }, // nhắc tên ái trong bài post
    medias: { type: [String], default: [] },
    audience: { type: Number, default: TweetAudience.Everyone }, // post công khai hay là dữ kín
    type: { type: Number, default: TweetType.Tweet }, // dạng post hay commient
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
    user_views: { type: Number, default: 0 }, // views khi có người đăng nhập
    guest_views: { type: Number, default: 0 } // views khi k có người đăng nhập
  },
  {
    collection: 'tweet'
  }
)

export default tweetSchema
