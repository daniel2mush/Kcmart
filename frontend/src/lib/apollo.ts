import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

// import { errorLink } from './apollo_errors.ts'

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL

const link = new HttpLink({
  uri: GRAPHQL_URL,
  credentials: 'include',
})

export const apollo = new ApolloClient({
  link: link,

  cache: new InMemoryCache(),
})
