import mongoose from 'mongoose'

import SharePostSchema, { SharePostType } from '../schemas/share-post.schemas'

export const sharePostModel = mongoose.model<SharePostType>('share_post', SharePostSchema)
