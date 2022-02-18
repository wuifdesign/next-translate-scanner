const keyWithoutPlural = (key: string) => {
  return key.replace(/(?:_zero|_one|_two|_few|_many|_other|_[0-9]+)$/, '')
}

export default keyWithoutPlural
