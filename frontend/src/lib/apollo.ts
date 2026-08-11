import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

// import { errorLink } from './apollo_errors.ts'

const API_URL = import.meta.env.VITE_API_URL

const link = new HttpLink({
  uri: API_URL,
  credentials: 'include',
})

export const apollo = new ApolloClient({
  link: link,

  cache: new InMemoryCache(),
})
