
import {PRODUCTS_URL, UPLOAD_URL} from '../constants'
import {apiSlice} from "./apiSlice.js"

export const productApiSlice=apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts:builder.query({
            query: ()=> ({
                url: PRODUCTS_URL,
            }),
            keepUnusedDataFor:5,
            providesTags: ['Products'],
        }),
        getProductDetails: builder.query({
           query:(productId) => ({
            url:`${PRODUCTS_URL}/${productId}`,
           }),
           keepUnusedDataFor:5,
        }),
        createProduct: builder.mutation({
            query: ()=> ({
                url:PRODUCTS_URL,
                method:'POST'
            }),
            invalidatesTags:["Products"]
        }),
        updateProduct: builder.mutation({
            query:(data) =>({
            url:`${PRODUCTS_URL}/${data._id}`,
            method:'PUT',
            body:data,
        }),
        invalidatesTags:['Products']
        }),
        uploadProductImage: builder.mutation({
            query:(data)=>({
                url: `${UPLOAD_URL}`,
                method:'POST',
                body:data,

            })
        }),
        deleteProduct: builder.mutation({
            query: (productId)=>({
                url:`${PRODUCTS_URL}/${productId}`,
                method:'DELETE',
            })
        })
    })
})

export const {useCreateProductMutation, useGetProductsQuery, useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation, useDeleteProductMutation}=productApiSlice;