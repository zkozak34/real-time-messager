"use client";
import { SessionProvider } from 'next-auth/react'
import React from 'react'

interface IProps {
  children: React.ReactNode
}

function AuthContext({ children }: IProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default AuthContext