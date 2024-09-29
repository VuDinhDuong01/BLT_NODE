import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import {config} from 'dotenv'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
config({
  path: `.env.${process.env.CROSS_ENV}`
})
// import fs from 'fs'
// import path from 'path'
// import YAML from 'yaml'
import swaggerJsdoc from 'swagger-jsdoc'
import cookieParser from 'cookie-parser'
import { configEnv } from './constants/configENV'
import route from './routes/index.routes'
import { connectMongoose } from './models/connectDB/connect-mongoose'
// import { connectRedis } from './models/connectDB/connect-redis'
import { handleError } from './utils/handle-error'
import { checkFolderUploadImageExsis, checkFolderUploadVideoExsis } from './utils/handleUploadFile'
import { socketConfig } from './utils/socket'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
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

socketConfig(httpServer)

const port = configEnv.PORT || 4000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: 'http://localhost:5173',
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
// connectRedis()

checkFolderUploadImageExsis()
checkFolderUploadVideoExsis()

route(app)
app.use(handleError)
httpServer.listen(port as number, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
