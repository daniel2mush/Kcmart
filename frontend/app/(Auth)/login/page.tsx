'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from "react-hook-form"
import { LoginTypes } from '@/lib/types/authTypes'
import { LoginSchema } from '@/lib/validation/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import Image from "next/image"

const Login = () => {
  const router = useRouter()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginTypes>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function handleSubmitForm(value: LoginTypes) {
    setIsLoggingIn(true)

    const params = new URLSearchParams()
    params.set('username', value.email)
    params.set('password', value.password)

    try {
      // Call the LOCAL Next.js proxy, NOT the external backend
      const res = await fetch('/api/auth/jwt/login', {
        method: 'POST',
        body: params.toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include', // CRITICAL: Tells browser to save the cookie
      })

      if (res.ok) {
        toast.success('Login successful!')
        router.push('/dashboard')
        router.refresh() // Refreshes the Next.js server cache so SSR sees the cookie
      } else {
        const errorData = await res.json().catch(() => ({ detail: 'Login failed' }))
        toast.error(errorData.detail || 'Invalid credentials')
      }
    } catch (error) {
      console.error(error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="relative flex min-h-screen justify-center items-center overflow-hidden p-4">
      <div className="absolute w-full opacity-10 inset-0 z-0">
        <Image src="/Hero.webp" alt="Hero background" fill className="object-cover" priority />
      </div>
      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="z-40 rounded-2xl max-w-md w-full mx-auto bg-surface/80 backdrop-blur-xl p-8 border border-border shadow-2xl flex flex-col gap-6">

        <Link href="/" className="text-sm flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="text-center space-y-2">
          <h1 className="text-3xl text-primary font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Login to continue</p>
        </div>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="w-full space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-secondary">Email</label>
            <Input id="email" type="email" placeholder="name@example.com" {...register('email')} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-secondary">Password</label>
            <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoggingIn}>
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login