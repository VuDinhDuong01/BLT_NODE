import { Upload } from "@aws-sdk/lib-storage";
import {  S3 } from "@aws-sdk/client-s3";
import { configEnv } from "~/contants/configENV";
import fs from 'fs'

const client = new S3({
  region: configEnv.region, 
  credentials: {
    accessKeyId: configEnv.accessKeyId,
    secretAccessKey: configEnv.secretAccessKey
  }
});
export const uploadImageS3 = async ({ fileName, filePath, contentType }: { fileName: string, filePath: string, contentType: string }) => {

  const parallelUploads3 = new Upload({
    client: client,
    params: { Bucket: "upload-image-btl-nodejs", Key: fileName, Body: fs.readFileSync(filePath), ContentType: contentType },

    tags: [
    ], 
    queueSize: 4, // optional concurrency configuration
    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
    leavePartsOnError: false, // optional manually handle dropped parts
  });


  return await parallelUploads3.done();

}