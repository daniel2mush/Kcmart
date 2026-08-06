import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

// import { errorLink } from './apollo_errors.ts'

const link = new HttpLink({
  uri: 'http://localhost:8000/graphql',
  credentials: 'include',
})

export const apollo = new ApolloClient({
  link: link,

  cache: new InMemoryCache(),
})
