import { Router } from 'express'
import uploadCloud from '~/utils/cloudinary.config'

import { uploadFileController } from '~/controllers/upload-file'
import { validateAccessToken } from '~/middlewares/user.middlewares'
// enum MediaType {
//   IMAGE,
//   VIDEO
// }

const route = Router()
// route.post('/upload_image', validateAccessToken, uploadFileController.uploadImage)
route.post('/upload_video', validateAccessToken, uploadFileController.uploadVideo)
route.post(
  '/upload_image',
  validateAccessToken,
  uploadCloud.array('image'),
  uploadFileController.uploadImageWithCloudinary
)
export default route
