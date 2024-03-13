import mongoose from 'mongoose'

import notificationSchema, { type NotificationType } from '../schemas/notification.schemas'

export const notificationModel = mongoose.model<NotificationType>('notifications', notificationSchema)
