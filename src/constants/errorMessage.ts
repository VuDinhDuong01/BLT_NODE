type errorsType = {
  [key in string]: string
}

export class errorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    ;(this.status = status), (this.message = message)
  }
}

export class errorWithStatus422 {
  message: string
  status: number
  error: errorsType
  constructor({ error, message }: { message: string; error: errorsType }) {
    ;(this.message = message), (this.error = error)
    this.status = 422
  }
}
