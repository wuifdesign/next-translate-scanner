import React from 'react'
import { useTranslation } from 'next-translate'

export default function Description() {
  const { t } = useTranslation('ns1')
  const title = t('title')
  const nested = t('my.nested.key')
  const description = t`description`
  const example = t('ns2:example', { count: 3 }, { default: 'Example {{count}}' })

  return (
    <>
      <h1>{title}</h1>
      <p>{description}</p>
      <p>{example}</p>
      <p>{nested}</p>
    <>
  )
}
