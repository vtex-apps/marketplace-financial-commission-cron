export const generateToken = async (length: number): Promise<string> => {
  const a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split(
    ''
  )

  const b = []

  for (let i = 0; i < length; i++) {
    const j: any = (Math.random() * (a.length - 1)).toFixed(0)

    b[i] = a[j]
  }

  return b.join('')
}
