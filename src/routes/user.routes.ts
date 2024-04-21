import { Router } from 'express'
import { userControllers } from '~/controllers/user.controllers'
import {
  validateAccessToken,
  validateChangePassword,
  validateDataUser,
  validateRefreshToken,
  validationEmailVerifyToken,
  validationForgotPassword,
  validationForgotToken,
  validationLogin,
  validationRefreshToken,
  validationRegister,
  validationResetPassword
} from '~/middlewares/user.middlewares'

const route = Router()

route.post('/register', validationRegister, userControllers.register)
route.post('/email_verify_token', validationEmailVerifyToken, userControllers.EmailVerifyToken)
route.post('/login', validationLogin, userControllers.login)
route.post('/refresh_token', validationRefreshToken, userControllers.refresh_token)
route.post('/forgot_password', validationForgotPassword, userControllers.forgotPassword)
route.post('/forgot_password/:user_id', validationForgotToken, userControllers.verifyForgotPassword)
route.post('/reset_password/:user_id', validationResetPassword, userControllers.resetPassword)
route.get('/me/:user_id', validateAccessToken, userControllers.getMe)
route.patch('/update_me', validateAccessToken, validateDataUser, userControllers.updateMe)
route.patch(
  '/change_password',
  validateAccessToken,
  validateDataUser,
  validateChangePassword,
  userControllers.changePassword
)
route.post('/logout', validateAccessToken, validateRefreshToken, userControllers.logout)
route.get('/get_tweet_user/:user_id', validateAccessToken, userControllers.getTweetUser)
route.get('/get_search_user', validateAccessToken, userControllers.getSearchUser)

route.get('/all_user', validateAccessToken, userControllers.getAllPost)
route.delete('/user/:user_id', validateAccessToken, userControllers.deletePost)
route.delete('/user', validateAccessToken, userControllers.deleteManyPost)

export default route
