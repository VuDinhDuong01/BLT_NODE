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
