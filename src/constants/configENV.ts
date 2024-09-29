/* eslint-disable prettier/prettier */
import dotenv from 'dotenv'

 dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
});


export const configEnv = {
  PORT: process.env.PORT as string,
  PRIMARY_KEY: process.env.PRIMARY_KEY as string,
  URL_MONGOOSE: process.env.URL_MONGOOSE as string,
  URL_REDIS: process.env.URL_REDIS as string,
  secretAccessKey: process.env.secretAccessKey as string,
  accessKeyId: process.env.accessKeyId as string,
  region: process.env.region as string,
  fromEmail: process.env.fromEmail as string,
  toAddress: process.env.toAddress as string,
  URL_FE: process.env.localhost as string,
  PRIMARY_KEY_REFRESH_TOKEN: process.env.PRIMARY_KEY_REFRESH_TOKEN as string,
  URL_CLIENT: process.env.URL_CLIENT as string ,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME as string ,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string ,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string 
}
