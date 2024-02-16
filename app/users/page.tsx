"use client";
import { signOut } from 'next-auth/react'
import React from 'react'

function Users() {
  return (
    <div>
      <span>Users</span>
      <span onClick={() => signOut()}>Logout</span>
    </div>
  )
}

export default Users