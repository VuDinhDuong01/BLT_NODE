import { Router } from 'express'


import { repliesCommentController } from '~/controllers/repliesComment.controller'
import { validationComment } from '~/middlewares/comment.middlewares'
import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/replies_comment', validateAccessToken, repliesCommentController.create)

export default route
