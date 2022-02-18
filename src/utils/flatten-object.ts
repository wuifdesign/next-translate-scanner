const flattenObject = (ob: Record<string, any>, separator = '.') => {
  let toReturn: Record<string, any> = {}
  for (let i in ob) {
    if (!ob.hasOwnProperty(i)) {
      continue
    }
    if ((typeof ob[i]) == 'object' && ob[i] !== null) {
      const flatObject = flattenObject(ob[i], separator)
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) {
          continue
        }
        toReturn[i + separator + x] = flatObject[x]
      }
    } else {
      toReturn[i] = ob[i]
    }
  }
  return toReturn
}

export default flattenObject
