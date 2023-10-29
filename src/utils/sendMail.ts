import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import path from 'path'
import fs from 'fs'

import { configEnv } from '~/contants/configENV'

const template = fs.readFileSync(path.resolve('src/template/sendMail.template.html'), 'utf8')

const client = new SESClient({
  region: configEnv.region,
  credentials: {
    accessKeyId: configEnv.accessKeyId,
    secretAccessKey: configEnv.secretAccessKey
  }
})

export const sendMail = async ({
  object,
  subject,
  link,
  ReplyToAddresses = []
}: {
  ReplyToAddresses?: []
  object: string
  link:string 
  subject: string
}) => {
  const input = {
    Source: configEnv.fromEmail,
    Destination: {
      ToAddresses: [configEnv.toAddress]
      // CcAddresses: [
      //   "STRING_VALUE",
      // ],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8'
      },
      Body: {
        Html: {
          Data: template
            .replace('{{content}}', object)
            .replace('{{title}}', 'Xác thực email của bạn tại đây')
            .replace('{{titleLink}}', 'Xác Thực')
            .replace('{{link}}', link),
          Charset: 'UTF-8'
        }
      }
    },
    ReplyToAddresses: ReplyToAddresses
  }
  const command = new SendEmailCommand(input)
  return await client.send(command)
}
