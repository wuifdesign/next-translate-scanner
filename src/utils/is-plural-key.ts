const isPluralKey = (key: string) => {
  return /(?:_zero|_one|_two|_few|_many|_other|_[0-9]+)$/.test(key)
}

export default isPluralKey
