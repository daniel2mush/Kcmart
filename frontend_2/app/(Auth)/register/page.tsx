'use client'
import { RegistrationTypes } from '@/lib/types/authTypes'
import { RegistrationSchema } from '@/lib/validation/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import Image from "next/image";
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {Button} from "@/components/ui/button";

const Register = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationTypes>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmitForm = (value: RegistrationTypes) => {
    // mutate(value, {
    //   onSuccess: (data) => {
    //     toast.success('Registration successful, Login to continue')
    //     route.navigate({ to: '/signin' })
    //   },
    //   onError: (error) => {
    //     toast.error(error.message)
    //   },
    // })
  }
  return (
    <div className="relative flex min-h-screen justify-center items-center overflow-hidden">
      {' '}
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
          <p className="text-sm text-secondary">Register to continue</p>
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
            <label htmlFor="first-name" className=" text-sm text-secondary">
              Username
            </label>
            <Input
              placeholder="Enter your first name"
              {...register('username')}
            />
            {errors.username && (
              <p className=" text-[12px] text-red-500 mt-3">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="first-name" className=" text-sm text-secondary">
              First name
            </label>
            <Input
              placeholder="Enter your first name"
              {...register('first_name')}
            />
            {errors.first_name && (
              <p className=" text-[12px] text-red-500 mt-3">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="last name" className=" text-sm text-secondary">
              Last name
            </label>
            <Input
              placeholder="Enter your last name"
              {...register('last_name')}
            />
            {errors.last_name && (
              <p className=" text-[12px] text-red-500 mt-3">
                {errors.last_name.message}
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
          <div>
            <label
              htmlFor="confirm-password"
              className=" text-sm text-secondary"
            >
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className=" text-[12px] text-red-500 mt-3">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full text-app cursor-pointer mt-2">
            Register
          </Button>
        </form>
        <p className=" text-sm text-secondary">
          Already have an account ?{' '}
          <Link href="/login" className=" text-primary">
            Login
          </Link>{' '}
        </p>
      </div>
    </div>
  )


}
export default Register
