import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
import { Request, Response } from 'express'
import sharp from 'sharp'
import { handleUploadFile, handleUploadVideo } from '~/utils/handleUploadFile'
import { uploadImageS3 } from '~/utils/s3'
import fsPromise from 'fs/promises'
import fs from 'fs'
import path from 'path'
import mime from 'mime'
import { userModel } from '~/models/model/user.model'
import { verify_access_token } from '~/type'

enum MediaType {
  IMAGE,
  VIDEO
}

export const uploadFileController = {
  uploadImage: async (req: Request, res: Response) => {
    try {
      const file = await handleUploadFile(req)
      const fileResult = await Promise.all(
        file.map(async (image:any) => {
          const newFile = image.newFilename.split('.')[0]
          const fileNameImage = `${newFile}.jpg`
          await sharp(image.filepath).jpeg({
            quality: 60
          })

          const uploadImageResponse = await uploadImageS3({
            fileName: 'images/' + fileNameImage,
            filePath: image.filepath,
            contentType: 'image/jpeg'
          })
          if (fs.existsSync(path.resolve('uploads/images', image.filepath))) {
            await Promise.all([
              fsPromise.unlink(image.filepath),
              fsPromise.unlink(path.resolve('uploads/images', image.filepath))
            ])
          }
          return {
            image: (uploadImageResponse as CompleteMultipartUploadCommandOutput).Location as string,
            type: MediaType.IMAGE
          }
        })
      )
      return res.json(fileResult)
    } catch (error) {
      console.log(error)
    }
  },
  uploadVideo: async (req: Request, res: Response) => {
    try {
      const fileVideo = await handleUploadVideo(req)
      const { filepath, newFilename } = fileVideo[0]
      const range = req.headers.range
      if (!range) {
        return res.status(400).send('Requires Range header')
      }
      const videoPath = filepath
      const videoSize = fs.statSync(videoPath).size
      const CHUNK_SIZE = 0
      const start = Number(range?.replace(/\D/g, ''))
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
      const contentLength = end - start + 1
      const contentType = mime.getType(filepath) || 'video/*'
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': contentType
      }
      res.writeHead(206, headers)
      const videoStream = fs.createReadStream(videoPath, { start, end })
      videoStream.pipe(res)
      const uploadVideoS3 = await uploadImageS3({
        fileName: 'videos/' + newFilename,
        filePath: filepath,
        contentType: contentType
      })
      if (fs.existsSync(path.resolve('uploads/videos', newFilename))) {
        await fsPromise.unlink(filepath)
      }
      return res.json({
        video: (uploadVideoS3 as CompleteMultipartUploadCommandOutput).Location,
        type: MediaType.VIDEO
      })
    } catch (error) {
      console.log(error)
    }
  }
}
