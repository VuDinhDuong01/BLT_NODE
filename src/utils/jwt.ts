import jwt from 'jsonwebtoken'

interface JWT {
  payload: string | object | Buffer
  privateKey: string
  options?: jwt.SignOptions
}

export const signJWT = ({ payload, privateKey, options = { algorithm: 'HS256' } }: JWT) => {
  return new Promise<string>((resolve, rejects) => {
    jwt.sign(payload, privateKey, options, function (err, token) {
      if (!err) {
        resolve(token as string)
      }
      rejects(err)
    })
  })
}

export const verifyJWT = ({ privateKey, payload }: { privateKey: string; payload: string }) => {
  return new Promise((resolve, rejects) => {
    jwt.verify(payload, privateKey, function (err, token) {
      if (!err) {
        resolve(token as string)
      }
      rejects(err)
    })
  })
}
