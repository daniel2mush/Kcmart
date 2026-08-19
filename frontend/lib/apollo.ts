import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

// import { errorLink } from './apollo_errors.ts'

const link = new HttpLink({
  uri: '/api/graphql',
  credentials: 'include',
})

export const apollo = new ApolloClient({
  link: link,

  cache: new InMemoryCache(),
})
