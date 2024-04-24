import { Router } from 'express'

import { commentController } from '~/controllers/comment.controller'
import { validationComment } from '~/middlewares/comment.middlewares'
import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/create_comment', validateAccessToken, validationComment, commentController.create)
route.delete('/unComment', validateAccessToken, commentController.delete)
route.patch('/update_comment', validateAccessToken, commentController.edit)
route.get('/comment/:tweet_id', validateAccessToken, commentController.getList)

route.get('/all_comment', commentController.getAllComment)
route.delete('/comment', commentController.deleteComment)
route.delete('/many_comment', commentController.deleteManyComment)

export default route
