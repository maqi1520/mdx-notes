import { getUserDetails } from '@/utils/database'
import React from 'react'

type Props = {
  children: React.ReactNode
}

export default async function Layout({ children }: Props) {
  const userDetails = getUserDetails()
  console.log(userDetails)

  return <div>{children}</div>
}
