export const getKeyFromObject = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum) as number[]
}
