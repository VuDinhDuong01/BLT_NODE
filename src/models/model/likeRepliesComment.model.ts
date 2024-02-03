import mongoose from 'mongoose'


import RepliesLikeCommentSchema, { RepliesLikeCommentType } from '../schemas/likeRepliesComment.schemas'

export const repliesLikeCommentModel = mongoose.model<RepliesLikeCommentType>('replieslike_comment', RepliesLikeCommentSchema)
