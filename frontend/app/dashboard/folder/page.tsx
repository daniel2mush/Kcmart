import React from 'react'
import {requireAuth} from "@/lib/helpers/authentication/authenticate";

const Products = async() => {
    await requireAuth()
    return (
        <div>Products</div>
    )
}
export default Products
