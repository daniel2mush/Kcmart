import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

export const apollo = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:8000/graphql',
    credentials: 'include',
  }),

  cache: new InMemoryCache(),
})
