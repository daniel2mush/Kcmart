'use client'
import React from 'react'
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from "react-hook-form"
import {LoginTypes } from '@/lib/types/authTypes';
import { LoginSchema } from '@/lib/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import { Input } from '@/components/ui/input';
import {Button} from "@/components/ui/button";
import Image from "next/image";

const Login = () => {

  // const { setUser } = useUserStore()

  // const { mutate, isPending } = useLogin()
  const route = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginTypes>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmitForm = (value: LoginTypes) => {
    // mutate(
    //   { ...value },
    //   {
    //     onSuccess: async () => {
    //       toast.success('Login successful')
    //
    //     },
    //     onError: (data) => {
    //       toast.error(data.message || 'An error occurred while logging in')
    //     },
    //   },
    // )
  }
  return (
    <div className="relative flex min-h-screen justify-center items-center overflow-hidden">
      <div className="absolute w-full opacity-10 inset-0 z-0">
        <Image
          src="/Hero.webp"
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      </div>

            <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Login screen */}
      <div className=" gap-3 z-40 rounded-md max-w-lg w-full mx-auto bg-app p-10 border border-border flex justify-center flex-col items-center">
        <div className=" w-full items-start">
          <Link href="/" className=" text-sm flex items-center gap-4  ">
            <ArrowLeft size={12} />
            Home
          </Link>
        </div>
        {/* Header */}
        <div className=" text-center">
          <h1 className=" text-3xl text-secondary font-bold">Welcome back</h1>
          <p className="text-sm text-secondary">Login to continue</p>
        </div>
        {/* Socials */}
        {/* <Button variant={'outline'} size={'sm'} className="w-full ">
          Login with google
        </Button> */}
        <div />
        {/* <p className=" text-sm text-secondary">
          Or login with your email and password
        </p> */}
        {/* Forms */}
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className=" w-full space-y-4"
        >
          <div>
            <label htmlFor="email" className=" text-sm text-secondary">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register('email')}
            />
            {errors.email && (
              <p className=" text-[12px] text-red-500 mt-3">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className=" text-sm text-secondary">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register('password')}
            />
            {errors.password && (
              <p className=" text-[12px] text-red-500 mt-3">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full text-app cursor-pointer mt-2">
            Login
            {/*{isPending ? 'Logging in...' : 'Login'}*/}
          </Button>
        </form>
        <p className=" text-sm text-secondary">
          Don&#39;t have an account ?{' '}
          <Link href="/register" className=" text-primary">
            Register
          </Link>{' '}
        </p>
      </div>
    </div>
  )

}
export default Login

