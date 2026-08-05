import { gql } from '@apollo/client'

export const GET_All_PUBLISHED_PRODUCTS = gql`
  query GetProducts($page: Int!, $limit: Int!) {
    products(page: $page, limit: $limit) {
      id
      name
      slug
      description
      priceCent
      images
      status
      isFeatured
      categories
      tags
    }
  }
`

export const GET_USER_PRODUCTS = gql`
  query getUserProducts($page: Int!, $limit: Int!) {
    user_products(page: $page, limit: $limit) {
      id
      name
      description
      slug
      status
      priceCent
      included
      isFeatured
      images
      categories
      tags
      assetUrl
    }
  }
`
