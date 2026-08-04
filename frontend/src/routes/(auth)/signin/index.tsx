import { Button } from '#/components/ui/button'
import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '#/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { useLogin } from '#/components/queries/auth/AuthQuery'
import { toast } from 'sonner'
import { LoginSchema } from '#/lib/validation/auth.ts'
import type { LoginTypes } from '#/lib/types/authTypes.ts'
import { getIsAuthenticated } from '#/lib/helpers/authentication/authenticate.ts'

export const Route = createFileRoute('/(auth)/signin/')({
  component: RouteComponent,
  beforeLoad: async () => {
    const user = await getIsAuthenticated()
    if (user) {
      throw redirect({ to: '/dashboard' })
    }
  },
})

function RouteComponent() {
  // const { setUser } = useUserStore()

  const { mutate, isPending } = useLogin()
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
    mutate(
      { ...value },
      {
        onSuccess: async () => {
          toast.success('Login successful')
          await route.invalidate()
        },
        onError: (data) => {
          toast.error(data.message || 'An error occurred while logging in')
        },
      },
    )
  }
  return (
    <div className="relative flex min-h-screen justify-center items-center overflow-hidden">
      <div className=" z-0 absolute top-0 left-0 opacity-5">
        <img
          src="/Hero.webp"
          alt="Background"
          className=" object-cover object-center"
        />
      </div>
      {/* Login screen */}
      <div className=" gap-3 z-40 rounded-md max-w-lg w-full mx-auto bg-app p-10 border border-border flex justify-center flex-col items-center">
        <div className=" w-full items-start">
          <Link to="/" className=" text-sm flex items-center gap-4  ">
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
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p className=" text-sm text-secondary">
          Don't have an account ?{' '}
          <Link to="/register" className=" text-primary">
            Register
          </Link>{' '}
        </p>
      </div>
    </div>
  )
}
