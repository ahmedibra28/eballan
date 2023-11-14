import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Verify Email',
  }),
}

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
