import mongoose from 'mongoose'

import bookmarkSchema, { BookMarkType } from '../schemas/bookmark.schemas'

export const bookmarkModel = mongoose.model<BookMarkType>('bookmark', bookmarkSchema)
