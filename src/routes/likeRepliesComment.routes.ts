import { Router } from 'express'

import { likeCommentController } from '~/controllers/likeComment.controller'
import { repliesLikeCommentController } from '~/controllers/likeRepliesComment.controller'
import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/like_replies_comment', validateAccessToken, repliesLikeCommentController.create)

export default route
