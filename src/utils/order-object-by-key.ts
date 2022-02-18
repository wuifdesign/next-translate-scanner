const orderObjectByKey = (ob: Record<string, string | number>) => {
  return Object.keys(ob).sort().reduce((obj, key) => {
    (obj as any)[key] = ob[key]
    return obj
  }, {})
}

export default orderObjectByKey
