import mongoose from 'mongoose'

import conversationsSchema, { ConversationType } from '../schemas/conversations.schemas'

export const conversationsModel = mongoose.model<ConversationType>('conversations', conversationsSchema)
