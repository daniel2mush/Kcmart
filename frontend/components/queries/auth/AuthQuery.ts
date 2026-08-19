//
//
// type LoginPayload = {
//   email: string
//   password: string
// }
//
// export const useLogin = () => {
//   return useMutation({
//     mutationFn: async (data: LoginPayload) => {
//       // requestAuth('/api/auth/login', data, 'An error occurred during login'),
//
//       const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         body: JSON.stringify(data),
//       })
//
//       const res_data = await res.json()
//       console.log(res_data)
//
//       if (res.status === 200) {
//         return res_data
//       }
//       console.log(res_data.detail)
//       throw new Error(res_data.detail)
//     },
//   })
// }
//
// export const UseRegister = () => {
//   return useMutation({
//     mutationFn: async (data: RegistrationTypes) => {
//       const res = await fetch('/api/auth/register', {
//         method: 'POST',
//         body: JSON.stringify(data),
//       })
//       const res_data = await res.json()
//       if (res.status === 201) {
//         return {
//           detail: 'User created successfully. Login to continue',
//         }
//       }
//       console.log(res_data)
//       throw new Error(res_data.detail)
//     },
//   })
// }
//
// export const useLogout = () => {
//   return useMutation({
//     mutationFn: async () => {
//       const res = await fetch('/api/auth/logout', {
//         method: 'POST',
//       })
//
//       if (res.status === 204) {
//         return {
//           detail: 'User logged out successfully',
//         }
//       }
//
//       console.log('We got here also')
//       const res_data = await res.json()
//       throw new Error(res_data.detail)
//     },
//   })
// }
//
// export const useGetUser = () => {
//   return useQuery({
//     queryKey: ['user'],
//     queryFn: async () => {
//       return (await getIsAuthenticated()) as User
//     },
//   })
// }
