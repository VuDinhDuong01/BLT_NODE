import { ObjectId } from 'mongoose'

export interface Tweet {
  _id?: ObjectId
  content?: string
  hashtags?: ObjectId[]
  mentions?: ObjectId[]
  medias?: string[]
  user_id: string
  audience?: TweetAudience
  guest_views?: number
  user_views?: number
  updated_at?: Date
  created_at?: Date
}

export enum TweetAudience {
  Everyone,
  TwitterCircle,
  Verified,
  OnlyAccount
}

interface RepliesLikeComments {
  _id: string
  id: string
  icon: string
}

interface InfoUser{
  username:string 
  avatar:string 
}
interface RepliesComments {
  _id: string
  user_id: string
  replies_comment_id: string
  replies_content_comment: string
  replies_image_comment: string[]
  replies_like_comments: RepliesLikeComments[]
  created_at: string
  updated_at: string
}
interface Comment {
  _id?: string
  username: string
  user_id: string
  tweet_id: string
  avatar: string
  content_comment: string
  image_comment: string[]
  created_at: string
  updated_at: string
  replies_comments: RepliesComments[],
  // total_records: number
  // limit: number

}
export interface TweetDetail {
  _id?: ObjectId
  content?: string
  hashtags?: string[]
  mentions?: string[]
  medias?: string[]
  audience?: TweetAudience
  guest_views?: number
  user_views?: number
  updated_at?: Date
  created_at?: Date
  user: { username: string; avatar: string; name: string }
  comments: Comment[]
  likes: Like[]
  like_count: number
}
interface Like {
  _id: string
  user_id: string
  status: boolean
  tweet_id: string
  created_at: string
  updated_at: string
}
