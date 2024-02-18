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

export interface TweetDetail {
  _id?: ObjectId
  content?: string
  hashtags?: string[]
  user_id: string
  mentions?: string[]
  medias?: string[]
  audience?: TweetAudience
  guest_views?: number
  user_views?: number
  updated_at?: Date
  created_at?: Date
  user: { username: string; avatar: string; name: string }
  likes: Like[]
  like_count: number
  bookmark: boolean
}
interface Like {
  _id: string
  user_id: string
  status: boolean
  tweet_id: string
  created_at: string
  updated_at: string
}
