const pluralKeys = [
  '_zero',
  '_one',
  '_two',
  '_few',
  '_many',
  '_other'
]

const getPluralKeys = (key: string) => {
  const keys: string[] = []
  for (const item of pluralKeys) {
    keys.push(key + item)
  }
  for (let i = 0; i < 1000; i++) {
    keys.push(key + '_' + i)
  }
  return keys
}

export default getPluralKeys
