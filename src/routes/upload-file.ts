import { Router } from 'express'

import { uploadFileController } from '~/controllers/upload-file'
import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/upload_image', validateAccessToken, uploadFileController.uploadImage)
route.post('/upload_video', validateAccessToken, uploadFileController.uploadVideo)

export default route
