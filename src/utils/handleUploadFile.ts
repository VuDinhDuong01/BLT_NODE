import { Request } from "express"
import path from 'path'
import fs from 'fs'
import formidable, { File } from 'formidable';


export const checkFolderUploadImageExsis = () => {
  const checkFolderImageExsis = path.resolve('uploads/images')
  if (!fs.existsSync(checkFolderImageExsis)) {
    fs.mkdirSync(checkFolderImageExsis, { recursive: true });
  }
}

export const checkFolderUploadVideoExsis = () => {
  const checkFolderVideoExsis = path.resolve('uploads/videos')
  if (!fs.existsSync(checkFolderVideoExsis)) {
    fs.mkdirSync(checkFolderVideoExsis, { recursive: true });
  }
}
export const handleUploadFile = async (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve('uploads/images'),
    keepExtensions: true,
    allowEmptyFiles: false,
    minFileSize: 1024,
    maxFileSize: 4 * 1024 * 1024,
    maxFields: 4,
    filter: function ({ name, originalFilename, mimetype }) {
      return (mimetype as string).includes("image");
    }
  })
  return await new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      if (!files.image) {
        console.error("No 'image' file found in parsed files.");
        reject(new Error("No 'image' file found."));
        return;
      }

      resolve(files.image as File[]);
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve('uploads/videos'),
    keepExtensions: true,
    allowEmptyFiles: false,
    minFileSize: 1024,
    maxFileSize: 4 * 1024 * 1024*1024,
    maxTotalFileSize:4194304999999,
    maxFields: 1,
    filter: function ({ name, originalFilename, mimetype }) {
      return (mimetype as string).includes("video");
    }
  })
  return await new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      if (!files.video) {
        console.error("No 'video' file found in parsed files.");
        reject(new Error("No 'video' file found."));
        return;
      }

      resolve(files.video as File[]);
    })
  })
}