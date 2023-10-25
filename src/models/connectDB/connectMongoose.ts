import mongoose from "mongoose"

export const connectMongoose = async () => {
  try {
    await mongoose.connect('mongodb+srv://ngocduong:user123@ngocduong.t3arsrx.mongodb.net/btl')
    console.log('connect successfully')
  } catch (e) {
    console.log('connect failed')
  }
}