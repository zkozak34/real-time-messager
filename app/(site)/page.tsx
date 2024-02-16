import Image from 'next/image'
import React from 'react'
import AuthForm from './components/AuthForm'

function Home() {
  return (
    <div className='min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <Image alt='logo' width={48} height={48} className='mx-auto w-auto' src="/images/logo.png" />
        <h2 className='mt-6 text-center text-2xl font-bold tracking-tight text-gray-900'>
          Sing in to your account
        </h2>
      </div>
      <AuthForm />
    </div>
  )
}

export default Home