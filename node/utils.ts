export const generateToken = async (length: number): Promise<string> => {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('')

  const token = []

  for (let i = 0; i < length; i++) {
    const j: any = (Math.random() * (characters.length - 1)).toFixed(0)

    token[i] = characters[j]
  }

  return token.join('')
}
