import mongoose from 'mongoose'

import LikeCommentSchema, { LikeCommentType } from '../schemas/like_comment'

export const likeCommentModel = mongoose.model<LikeCommentType>('comment', LikeCommentSchema)
