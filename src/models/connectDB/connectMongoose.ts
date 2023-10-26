import mongoose from "mongoose"
import { configEnv } from "~/contants/configENV"
export const connectMongoose = async () => {
  try {
    await mongoose.connect(`${configEnv.URL_MONGOOSE}btl`)
    console.log('connect successfully')
  } catch (e) {
    console.log('connect failed')
  }
}