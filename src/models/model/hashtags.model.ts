import mongoose from "mongoose";

import hashTagsSchema from "../schemas/hastag.schemas";
import { HashTagsType } from "~/types/hashtag.types";


export const hashTagsModel = mongoose.model<HashTagsType>('hashtags', hashTagsSchema);