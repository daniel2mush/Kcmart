'use client'

import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client'
import { ReactNode } from 'react'
import {ApolloProvider} from "@apollo/client/react";

const link = new HttpLink({
  uri: '/api/graphql',
  credentials: 'include',
})

export const client = new ApolloClient({
  link: link,

  cache: new InMemoryCache(),
})

export default function ApolloProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}