"use client"
import Button from '@/app/components/Button';
import Input from '@/app/components/Inputs/Input';
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import AuthSocialButton from './AuthSocialButton';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

enum VariantTypes {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER'
}
type Variant = keyof typeof VariantTypes
type SocialAction = 'github' | 'google'

const AuthFormTexts: Record<VariantTypes, {
  submitButtonText: string
  changeVariantTexts: {
    text: string
    link: string
  }
}> = {
  [VariantTypes.LOGIN]: {
    submitButtonText: 'Sign in',
    changeVariantTexts: {
      text: 'Don\'t have an account?',
      link: 'Register'
    }
  },
  [VariantTypes.REGISTER]: {
    submitButtonText: 'Register',
    changeVariantTexts: {
      text: 'Already have an account?',
      link: 'Sign in'
    }
  }
}

function AuthForm() {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if(session?.status === 'authenticated') {
      router.push('/users')
    }
  }, [session?.status])

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER')
    } else {
      setVariant('LOGIN')
    }
  }, [variant])

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true)
    if (variant === 'REGISTER') {
      axios.post('/api/register', data)
        .then(() => signIn('credentials', data))
        .catch((error) => toast.error('Something went wrong! Please try again.'))
        .finally(() => setIsLoading(false))
    }

    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((response) => {
          if (response?.error) {
            toast.error(response.error)
          }
          if (response?.ok && !response.error) {
            toast.success('Logged in successfully')
          }
        }).finally(() => setIsLoading(false))
      // axios.post('/api/auth/login', data)
    }
  }

  const socialAction = (action: SocialAction) => {
    setIsLoading(true)
    signIn(action, { redirect: false })
      .then((response) => {
        if (response?.error) {
          toast.error(response.error)
        }
        if (response?.ok && !response.error) {
          toast.success('Logged in successfully')
        }
      }).finally(() => setIsLoading(false))
  }

  return (
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
      <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input id='name' label='Name' register={register} errors={errors} required disabled={isLoading} />
          )}
          <Input id='email' label='Email Address' type='email' register={register} errors={errors} required disabled={isLoading} />
          <Input id='password' label='Password' type='password' register={register} errors={errors} required minLenght={8} disabled={isLoading} />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {AuthFormTexts[variant as VariantTypes].submitButtonText}
            </Button>
          </div>
        </form>
        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-white px-2 text-gray-500'>Or continue with</span>
            </div>
          </div>
          <div className='mt-6 flex gap-2'>
            <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
            <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
          </div>
        </div>
        <div className='flex justify-center gap-2 text-sm mt-6 px-2 text-gray-500'>
          <div>
            {AuthFormTexts[variant as VariantTypes].changeVariantTexts.text}
          </div>
          <div onClick={toggleVariant} className='underline cursor-pointer'>
            {AuthFormTexts[variant as VariantTypes].changeVariantTexts.link}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm