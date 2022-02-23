# next-translate Scanner

[![npm version](https://img.shields.io/npm/v/next-translate-scanner)](https://www.npmjs.com/package/next-translate-scanner)

Used to extract translations for https://github.com/vinissimus/next-translate.

When translating an application, maintaining the translation catalog by hand is painful. 
This package parses your code and automates this process.

## Features

- Choose your weapon: A CLI, a standalone parser or a stream transform
- Creates one catalog file per locale and per namespace
- Supports next-translate features:
    - **Default Value**: fill translations with provided default values
    - **Plural**: keys of the form `key_zero`, `key_one`, `key_two`, `key_few`, `key_many` , `key_other` and numbers

## Usage

### CLI

```bash
npm install next-translate-scanner -D
```

```js
// next-translate-scanner.config.js
module.exports = {
  input: [
    './pages/**/*.@(jsx|tsx|js|ts)', 
    './components/**/*.@(jsx|tsx|js|ts)'
  ],
  output: './locales/$LOCALE/$NAMESPACE.json'
}

```

```
// package.json
{
  "scripts": {
    ...
    "extract-translations": "next-translate-scanner"
  }
}
```

### *.ts / *.tsx

Typescript is supported via Javascript and Jsx lexers. If you are using Javascript syntax (e.g. with React), follow the steps in Jsx section, otherwise Javascript section.

### Configuration

```ts
type ScannerConfig = {
  // Array of strings using the glob syntax (https://www.npmjs.com/package/glob)
  input: string[] | string
  // Available locales, can be importet from i18n.js
  locales: string[]

  // Change the separator that is used for nested keys. Set to false to disable keys nesting in JSON translation files. Can be useful if you want to use natural text as keys.
  keySeparator: string
  // Char to split namespace from key. You should set it to false if you want to use natural text as keys.
  nsSeparator: string
  // Default namespace used if not passed to useTranslation or in the translation key.
  defaultNS?: string

  // If keys inside json should be sorted
  sort: boolean
  // If keys removed from code should be deleted automatically
  keepRemoved: boolean
  // Output path for the generated files (default: './locales/$LOCALE/$NAMESPACE.json')
  output: string
  // Create default value from element
  defaultValue: (data: ExtractedElement) => string | null | undefined
  // Indention used in json files (default: 2 spaces)
  indentation: number
  // Replace existing translations if default values are set in code
  replaceDefaults: boolean
  // Fail the task if any warning is triggered
  failOnWarnings: boolean
}
```

### Caveats

While next-translate extracts translation keys in runtime, next-translate-scanner doesn't run the code, so it can't interpolate values in these expressions:

```
t(key)
t('key' + id)
t(`key${id}`)
```

As a workaround you should specify possible static values in comments anywhere in your file:

```
// t('key_1')
// t('key_2')
t(key)

/*
t('key1')
t('key2')
*/
t('key' + id)
```

## Info

Lexers where inspired by https://github.com/i18next/i18next-parser
