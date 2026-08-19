import React from 'react'
import {AdminProduct} from "@/components/Dashboard/Product";
import {requireAuth} from "@/lib/helpers/authentication/authenticate";

const Products = async() => {
    await requireAuth()
    return (
       <AdminProduct/>
    )
}
export default Products
