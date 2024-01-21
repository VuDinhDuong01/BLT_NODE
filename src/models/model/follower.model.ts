import mongoose from 'mongoose'

import followerSchema, { FollowType } from '../schemas/follower.schemas'


export const followModel = mongoose.model<FollowType>('follow', followerSchema)
