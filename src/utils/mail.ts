import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'duong2lophot@gmail.com',
    pass: 'bftpxntrjalxllfw'
  }
})

// async..await is not allowed in global scope, must use a wrapper
export const sendEMail = async ({ to, subject, object }: { to: string; subject: string; object: string }) => {
  // send mail with defined transport object
  try {
    await transporter.sendMail({
      from: 'Xác Thực email của bạn', // sender address
      to: to, // list of receivers
      subject: subject,
      html: object // html body
    })
  } catch (error: any) {
    console.log(error)
  }
}
