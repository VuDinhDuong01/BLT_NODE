import { Router } from 'express'

import { commentController } from '~/controllers/comment.controller'
import { validationComment } from '~/middlewares/comment.middlewares'
import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/comment', validateAccessToken, validationComment, commentController.create)
route.delete('/unComment', validateAccessToken, commentController.delete)
route.patch('/update_comment', validateAccessToken, commentController.edit)
route.get('/getComment', validateAccessToken, commentController.get)

export default route
