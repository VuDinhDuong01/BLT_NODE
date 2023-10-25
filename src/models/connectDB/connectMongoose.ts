import mongoose from "mongoose"

export const connectMongoose = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/testmongodb+srv://user:<password>@mongooseclient.pheduti.mongodb.net/')
    console.log('connect successfully')
  } catch (e) {
    console.log('connect failed')
  }
}