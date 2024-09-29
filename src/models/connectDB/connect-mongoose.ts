import mongoose from "mongoose"
import { configEnv } from "~/constants/configENV"

export const connectMongoose = async () => {

  try {
    await mongoose.connect(configEnv.URL_MONGOOSE)
    console.log('connect successfully')
  } catch (e) {
    console.log('connect failed')
  }
}