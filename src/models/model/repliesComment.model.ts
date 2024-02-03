import mongoose from 'mongoose'


import { RepliesCommentType, repliesCommentSchema } from '../schemas/repliesComment.schemas'

export const repliesCommentModel = mongoose.model<RepliesCommentType>('replies_like_comment', repliesCommentSchema)
