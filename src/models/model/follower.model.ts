import mongoose from "mongoose";
import followerSchema from "../schemas/follower.schemas";
import { FolloweType } from "~/type";

export const followModel = mongoose.model<FolloweType>('userFollow', followerSchema);