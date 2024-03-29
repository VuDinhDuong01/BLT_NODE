import { Router } from 'express'

import { likeCommentController } from '~/controllers/likeComment.controller'
import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/like_comment', validateAccessToken, likeCommentController.create)

export default route
