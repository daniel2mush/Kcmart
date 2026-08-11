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
      asset {
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
        id
        name
      }
      tags {
        id
        name
      }
    }
  }
`

export const CREATE_PRODUCT = gql`
  mutation createProduct(
    $name: String!
    $description: String!
    $priceCent: Int!
    $included: [String!]!
    $categoriesIds: [UUID!]!
    $tagIds: [UUID!]!
    $images: [String!]!
    $assetUrl: String!
  ) {
    create_product(
      data: {
        name: $name
        description: $description
        priceCent: $priceCent
        included: $included
        categoriesIds: $categoriesIds
        tagIds: $tagIds
        images: $images
        assetUrl: $assetUrl
      }
    ) {
      id
    }
  }
`

export const PUBLISH_PRODUCT = gql`
  mutation publish_product($slug: String!) {
    publishProduct(data: { slug: $slug })
  }
`

export const DELETE_PRODUCT = gql`
  mutation delete_product($slug: String!) {
    deleteProduct(slug: $slug)
  }
`

// export const UPDATE_PRODUCT = gql`
//   mutation update_product(
//     $slug: String!
//     $name: String
//     $description: String
//     $priceCent: Int
//     $included: [String!]
//   ) {
//     updateProduct(
//       slug: $slug
//       data: {
//         name: $name
//         description: $description
//         priceCent: $priceCent
//         included: $included
//       }
//     ) {
//       id
//     }
//   }
// `

export const UPDATE_PRODUCT = gql`
  mutation update_product(
    $name: String!
    $description: String!
    $priceCent: Int!
    $included: [String!]!
    $slug: String!
    $tagIds: [UUID!]!
    $categoriesIds: [UUID!]!
    $product_id: UUID!
  ) {
    updateProduct(
      slug: $slug
      data: {
        name: $name
        description: $description
        priceCent: $priceCent
        included: $included
        categoriesIds: $categoriesIds
        tagIds: $tagIds
        id: $product_id
      }
    ) {
      id
    }
  }
`
