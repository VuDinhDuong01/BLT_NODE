import { Router } from 'express'

import { conversationsController } from '~/controllers/conversations.controller'
import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/conversations/:receiver_id', validateAccessToken, conversationsController.create)
route.delete('/delete_bookmark', validateAccessToken, conversationsController.delete)
route.get('/conversations/:receiver_id', validateAccessToken, conversationsController.getConversations)

export default route
