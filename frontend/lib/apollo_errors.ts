// import { ErrorLink } from '@apollo/client/link/error'
//
// let isRedirecting = false
//
// export const errorLink = new ErrorLink(({ error }) => {
//   if (
//     typeof window !== 'undefined' &&
//     error.message.includes('Authentication required') &&
//     !isRedirecting
//   ) {
//     isRedirecting = true
//     window.location.href = '/signin'
//   }
// })
