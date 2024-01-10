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
route.get('/me', validateAccessToken, userControllers.getMe)
route.patch('/update_me', validateAccessToken, validateDataUser, userControllers.updateMe)
route.patch('/change_password', validateAccessToken, validateDataUser, validateChangePassword, userControllers.changePassword)
route.post('/logout', validateAccessToken, validateRefreshToken, userControllers.logout)

export default route
