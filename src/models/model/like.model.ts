import mongoose from 'mongoose'

import likeSchema, { LikeType } from '../schemas/like.schemas'

export const likeModel = mongoose.model<LikeType>('like', likeSchema)
