import { Router } from 'express'

import { notificationController } from '~/controllers/notification.controller'
import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.delete('/delete_notification', validateAccessToken, notificationController.delete)
route.get('/notification/:user_id', validateAccessToken, notificationController.getConversations)

export default route
