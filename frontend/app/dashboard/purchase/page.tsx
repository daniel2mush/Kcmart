import React from 'react'
import {requireAuth} from "@/lib/helpers/authentication/authenticate";

const Purchase = async () => {
    await requireAuth()
    return (
        <div>Purchase</div>
    )
}
export default Purchase
