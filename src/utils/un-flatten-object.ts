const unFlattenObject = (object: Record<string, any>, separator = '.') => {
  const result: Record<string, any> = {}
  for (let i in object) {
    const keys = i.split(separator)
    keys.reduce((r, e, j) => {
      return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 == j ? object[i] : {}) : [])
    }, result)
  }
  return result
}

export default unFlattenObject
