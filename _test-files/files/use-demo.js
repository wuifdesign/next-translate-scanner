import React from 'react'
import useTranslation from 'next-translate/useTranslation'

export default function useDemo() {
  const { t } = useTranslation('ns1')
  const title = t('title')
  const description = t`description`
  const example = t('ns2:example', { count: 3 })

  return title + description + example
}
