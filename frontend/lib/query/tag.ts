import { gql } from '@apollo/client'

export const GET_TAGS = gql`
  query tags {
    tags {
      id
      name
    }
  }
`
