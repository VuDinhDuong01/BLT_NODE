import crypto from 'crypto'

export const hashPassword = (password: string) => {
  const hash = crypto.createHash('sha256');
  const hashedPassword = hash.update(password + 'abcde', 'utf8').digest('hex');
  return hashedPassword;
}