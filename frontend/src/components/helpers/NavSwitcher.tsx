import { useEffect, useState } from 'react'
import { getIsAuthenticated } from '#/lib/helpers/authentication/authenticate.ts'
import NavBar from '#/components/NavBar.tsx'

export default function NavSwitcher() {
  const [loggedIn, setLoggedIn] = useState(false)

  async function AuthChecker() {
    const result = await getIsAuthenticated()
    setLoggedIn(!!result)
  }

  useEffect(() => {
    AuthChecker()
  })

  return <div> {loggedIn ? '' : <NavBar />}</div>
}
