import mongoose from "mongoose";
import { RefreshTokenType } from "~/types/users.types";
import refreshTokenSchema from "../schemas/refresh_token.schema";

export const refreshTokenModel = mongoose.model<RefreshTokenType>('refreshTokenModel', refreshTokenSchema);