import { Router } from 'express'


import { repliesCommentController } from '~/controllers/repliesComment.controller'
import { validationComment } from '~/middlewares/comment.middlewares'
import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/replies_comment', validateAccessToken, repliesCommentController.create)
route.patch('/update_replies_comment', validateAccessToken, repliesCommentController.update)
route.delete('/unReplies_comment', validateAccessToken, repliesCommentController.delete)
route.patch('/edit_replies_comment', validateAccessToken, repliesCommentController.edit)

export default route
