import { gql } from '@apollo/client'

export const GET_All_PUBLISHED_PRODUCTS = gql`
  query GetProducts($page: Int!, $limit: Int!) {
    products(page: $page, limit: $limit) {
      id
      name
      slug
      description
      included
      priceCent
      images {
        url
      }
      status
      categories {
        name
      }
      tags {
        name
      }
    }
  }
`

export const GET_USER_PRODUCTS = gql`
  query getUserProducts($page: Int!, $limit: Int!) {
    userProduct(page: $page, limit: $limit) {
      id
      name
      slug
      description
      priceCent
      included
      images {
        url
      }
      status
      isFeatured
      categories {
        name
      }
      tags {
        name
      }
    }
  }
`

export const GET_PRODUCT_WITH_SLUG = gql`
  query getProductWithSlug($slug: String!) {
    productWithSlug(slug: $slug) {
      id
      name
      slug
      description
      priceCent
      included
      images {
        url
      }
      status
      categories {
        name
      }
      tags {
        name
      }
    }
  }
`
