import React from 'react'
import {requireAuth} from "@/lib/helpers/authentication/authenticate";

const Profile = async() => {
    await requireAuth()
    return (
        <div>Profile</div>
    )
}
export default Profile
