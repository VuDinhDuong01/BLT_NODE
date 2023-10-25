import mongoose from "mongoose";
import userSchema from "../schemas/user.schemas";
import { userType } from "~/types/users.types";

export const userModel = mongoose.model<userType>('userModel', userSchema);