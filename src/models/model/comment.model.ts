import mongoose from 'mongoose'


import commentSchema, { CommentType } from '../schemas/comment.schemas'

export const commentModel = mongoose.model<CommentType>('comment', commentSchema)
