import React from 'react'
import {requireAuth} from "@/lib/helpers/authentication/authenticate";

const Settings = async () => {

    await requireAuth()
    return (
        <div>Settings</div>
    )
}
export default Settings
