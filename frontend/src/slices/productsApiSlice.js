import {PRODUCTS_URL} from '../constants'
import {apiSlice} from "/apiSLice.js"

export const productApiSlice=apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts:builder.query({
            query: ()=> ({
                url: PRODUCTS_URL,
            }),
            keepUnusedDataFor:5
        })
    })
})

export const {useGetProductsQuery}=productApiSlice;