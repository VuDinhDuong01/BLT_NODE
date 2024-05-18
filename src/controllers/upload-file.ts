import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
import { Request, Response } from 'express'
import sharp from 'sharp'
import { handleUploadFile } from '~/utils/handleUploadFile'
import { uploadImageS3 } from '~/utils/s3'
import fs from 'fs'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { configEnv } from '~/constants/configENV'
enum MediaType {
  IMAGE,
  VIDEO
}
const typeVides = [
  'video/mp4',
  'video/x-msvideo',
  'video/quicktime',
  'video/x-ms-wmv',
  'video/x-flv',
  'video/x-matroska',
  'video/webm',
  'video/3gpp',
  'video/mpeg'
];
export const uploadFileController = {
  uploadImage: async (req: Request, res: Response) => {
    try {
      const file = await handleUploadFile(req)
      const fileResult = await Promise.all(
        file.map(async (image: any) => {
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
          // if (fs.existsSync(path.resolve('uploads/images', image.filepath))) {
          //   await Promise.all([
          //     fsPromise.unlink(image.filepath),
          //     fsPromise.unlink(path.resolve('uploads/images', image.filepath))
          //   ])
          // }
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
  uploadVideo: async (req: any, res: any) => {
    const storage = multer.diskStorage({
      filename: (req, file, cb) => {
        const fileExt = file.originalname.split('.').pop()
        const filename = `${new Date().getTime()}.${fileExt}`
        cb(null, filename)
      }
    })

    const fileFilter = (req: any, file: any, cb: any) => {
      if (typeVides.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(
          {
            message: 'Unsupported File Format'
          },
          false
        )
      }
    }

    const upload = multer({
      storage,
      limits: {
        fieldNameSize: 200,
        fileSize: 30 * 1024 * 1024 *1024
      },
      fileFilter
    }).single('video')

    upload(req, res, (err) => {
      if (err) {
        return res.send(err)
      }

      const { path } = (req as any).file

      const fName = (req as any).file.originalname.split('.')[0]
      cloudinary.config({
        cloud_name: configEnv.CLOUDINARY_NAME,
        api_key: configEnv.CLOUDINARY_API_KEY,
        api_secret: configEnv.CLOUDINARY_API_SECRET
      })
      cloudinary.uploader?.upload(
        path,
        {
          resource_type: 'video',
          public_id: `upload_video/${fName}`,
          chunk_size: 6000000,
          eager: [
            {
              width: 300,
              height: 300,
              crop: 'pad',
              audio_codec: 'none'
            },
            {
              width: 160,
              height: 100,
              crop: 'crop',
              gravity: 'south',
              audio_codec: 'none'
            }
          ]
        },

        (err: any, video: any) => {
          if (err) return res.send(err)

          fs.unlinkSync(path)
          return res.json({
            message: 'success',
            path: video.url
          })
        }
      )
    })
  }
}
