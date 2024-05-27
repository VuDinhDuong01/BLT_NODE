import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import { configEnv } from '~/constants/configENV'

// Cấu hình Cloudinary


// Cấu hình lưu trữ cho Multer sử dụng Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'upload_image',
//     // format: async (req: any, file: any) => {
//     //   const ext = file.mimetype.split('/')[1];
//     //   return ['jpg', 'png', 'jpeg', 'webp'].includes(ext) ? ext : 'jpg';
//     // },
//     // public_id: (req: any, file: any) => file.originalname,
//     // resource_type: 'image', // Ensure that the resource type is set to 'image'
//   } as any,
// });

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
// Tạo Multer middleware
const uploadCloud = multer({ storage })

// Xuất module
export default uploadCloud
