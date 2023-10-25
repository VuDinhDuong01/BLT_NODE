import mongoose from "mongoose";
import userSchema from "../schemas/user.schemas";

export const userModel = mongoose.model('userModel', userSchema);