import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
import swaggerJsdoc from 'swagger-jsdoc'

import { configEnv } from './contants/configENV'
import route from './routes/index.routes'
import { connectMongoose } from './models/connectDB/connectMongoose'
import { connectRedis } from './models/connectDB/connectRedis'
import { handleError } from './utils/handleError'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,

})
const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes*.js'],
}

const openapiSpecification = swaggerJsdoc(options);
// const file = fs.readFileSync('./swagger.yaml', 'utf8')
// const swaggerDocument = YAML.parse(file)

const app = express()
const port = configEnv.PORT || 4000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "allowedHeaders": ['Content-Type', 'Authorization']
}))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use(limiter)
app.use(helmet())

connectMongoose()
connectRedis()

route(app)
app.use(handleError)
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})