import { useEffect, useState } from 'react'
import {getIsAuthenticated} from "@/lib/helpers/authentication/authenticate";
import NavBar from "@/components/NavBar";

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
