const ACCENTED_MAP: Record<string, string> = {
  a: 'ȧ',
  A: 'Ȧ',
  b: 'ƀ',
  B: 'Ɓ',
  c: 'ƈ',
  C: 'Ƈ',
  d: 'ḓ',
  D: 'Ḓ',
  e: 'ḗ',
  E: 'Ḗ',
  f: 'ƒ',
  F: 'Ƒ',
  g: 'ɠ',
  G: 'Ɠ',
  h: 'ħ',
  H: 'Ħ',
  i: 'ī',
  I: 'Ī',
  j: 'ĵ',
  J: 'Ĵ',
  k: 'ķ',
  K: 'Ķ',
  l: 'ŀ',
  L: 'Ŀ',
  m: 'ḿ',
  M: 'Ḿ',
  n: 'ƞ',
  N: 'Ƞ',
  o: 'ǿ',
  O: 'Ǿ',
  p: 'ƥ',
  P: 'Ƥ',
  q: 'ɋ',
  Q: 'Ɋ',
  r: 'ř',
  R: 'Ř',
  s: 'ş',
  S: 'Ş',
  t: 'ŧ',
  T: 'Ŧ',
  v: 'ṽ',
  V: 'Ṽ',
  u: 'ŭ',
  U: 'Ŭ',
  w: 'ẇ',
  W: 'Ẇ',
  x: 'ẋ',
  X: 'Ẋ',
  y: 'ẏ',
  Y: 'Ẏ',
  z: 'ẑ',
  Z: 'Ẑ'
}

type OptsType = {
  prefix: string
  postfix: string
  map: Record<string, string>
  elongate: boolean
}

const defaultOptions: OptsType = {
  prefix: '',
  postfix: '',
  map: ACCENTED_MAP,
  elongate: true
}

const pseudoLocalizeString = (string: string, options: Partial<OptsType> = {}) => {
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  }
  let pseudoLocalizedText = ''
  for (const character of string) {
    if (mergedOptions.map[character]) {
      const cl = character.toLowerCase()
      // duplicate "a", "e", "o" and "u" to emulate ~30% longer text
      if (mergedOptions.elongate && (cl === 'a' || cl === 'e' || cl === 'o' || cl === 'u')) {
        pseudoLocalizedText += mergedOptions.map[character] + mergedOptions.map[character]
      } else {
        pseudoLocalizedText += mergedOptions.map[character]
      }
    } else {
      pseudoLocalizedText += character
    }
  }

  // If this string is from the DOM, it should already contain the pre- and postfix
  if (pseudoLocalizedText.startsWith(mergedOptions.prefix) && pseudoLocalizedText.endsWith(mergedOptions.postfix)) {
    return pseudoLocalizedText
  }
  return mergedOptions.prefix + pseudoLocalizedText + mergedOptions.postfix
}

export default pseudoLocalizeString
