import React from 'react'
import TemplateList from './template-list'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '模板列表',
}

export default async function Page() {
  return <TemplateList />
}
