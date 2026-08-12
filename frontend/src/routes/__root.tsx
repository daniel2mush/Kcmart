import {
  HeadContent,
  Outlet, // 👈 Import Outlet
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import Footer from '#/components/Footer'
import { Toaster } from 'sonner'
import NotFound from '#/components/NotFound.tsx'
import { ApolloProvider } from '@apollo/client/react'
import { apollo } from '#/lib/apollo.ts'
import NavSwitcher from '#/components/helpers/NavSwitcher.tsx'

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        title: 'TanStack Start Starter',
      },
      {
        name: 'theme-color',
        content: '#0a0a0a',
      },
      {
        name: 'theme-color',
        media: '(prefers-color-scheme: dark)',
        content: '#0a0a0a',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
      },
    ],
  }),
  // 1. Render active child routes inside root
  component: () => <Outlet />,

  // 2. Fallback when thrown at the root route level
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
  errorComponent: ({ error }) => {
    return (
      <div
        className={
          'w-full h-screen flex justify-center items-center text-center'
        }
      >
        <h2>Something went wrong</h2> <br />
        <p>{error.message}</p>
      </div>
    )
  },
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <NavSwitcher />
        <ApolloProvider client={apollo}>{children}</ApolloProvider>
        <Footer />
        <Toaster richColors={true} />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
