import { Router } from 'express'

import { commentController } from '~/controllers/comment.controller'
import { validationComment } from '~/middlewares/comment.middlewares'
import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/replies_comment', validateAccessToken, commentController.create)
route.delete('/unComment', validateAccessToken, validationComment, commentController.delete)
route.get('/getComment', validateAccessToken, commentController.get)

export default route
