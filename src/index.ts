import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
// import fs from 'fs'
// import path from 'path'
// import YAML from 'yaml'
import swaggerJsdoc from 'swagger-jsdoc'
import cookieParser from 'cookie-parser'
import { configEnv } from './constants/configENV'
import route from './routes/index.routes'
import { connectMongoose } from './models/connectDB/connect-mongoose'
import { connectRedis } from './models/connectDB/connect-redis'
import { handleError } from './utils/handle-error'
import { checkFolderUploadImageExsis, checkFolderUploadVideoExsis } from './utils/handleUploadFile'
import { conversationsModel } from './models/model/conversations.model'
import mongoose from 'mongoose'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false
})
const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0'
    }
  },
  apis: ['./src/routes*.js']
}

const openapiSpecification = swaggerJsdoc(options)
// const file = fs.readFileSync('./swagger.yaml', 'utf8')
// const swaggerDocument = YAML.parse(file)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ' http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
  }
})

const user: any = {}

io.on('connection', (socket) => {
  const user_id = socket.handshake.auth?._id
  if (user_id) {
    user[user_id] = {
      socket_id: socket.id
    }
  }

  console.log('user', user)

  socket.on('message_private', async (data: { content: string; to: string; from: string }) => {
    try {
      const receiver_socket_id = user[data.to]?.socket_id
      socket.to(receiver_socket_id).emit('send_message', data)
      await conversationsModel.create({
        sender_id: new mongoose.Types.ObjectId(data.from),
        receiver_id: new mongoose.Types.ObjectId(data.to),
        content: data.content
      })
    } catch (error: unknown) {
      console.log(error)
    }
  })
  socket.on('enter_text', (data) => {
    const receiver_socket_id = user[data.to]?.socket_id
    socket.to(receiver_socket_id).emit('listen_for_text_input_events', 'enter')
  })

  socket.on('no_enter_text', (data) => {
    const receiver_socket_id = user[data.to]?.socket_id
    socket.to(receiver_socket_id).emit('no_text_input_events', 'no_enter')
  })

  socket.on('send_notification_like', (data) => {
    const receiver_socket_id = user[data.to]?.socket_id
    socket.to(receiver_socket_id).emit('notification_like', data)
  })

  socket.on('follow_user', (data) => {
    const receiver_socket_id = user[data.to]?.socket_id
    socket.to(receiver_socket_id).emit('following_user', data)
  })

  socket.on('send_notification_bookmark', (data) => {
    const receiver_socket_id = user[data.to]?.socket_id
    socket.to(receiver_socket_id).emit('notification_bookmark', data)
  })

  socket.on('send_notification_comment', (data) => {
    const receiver_socket_id = user[data.to]?.socket_id
    socket.to(receiver_socket_id).emit('notification_comment', data)
  })

  socket.on('disconnect', () => {
    console.log('co user da roi khoi', socket.id)
    delete user[user_id]
    console.log(user)
  })
})
const port = configEnv.PORT || 4000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: ' http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
app.use(limiter)
app.use(helmet())
app.use(cookieParser())

connectMongoose()
connectRedis()

checkFolderUploadImageExsis()
checkFolderUploadVideoExsis()

route(app)
app.use(handleError)
httpServer.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
