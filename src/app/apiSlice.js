import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:2025/api/",
        prepareHeaders: (Headers, {getState}) => {
            const token = getState().user.credentials.token
            if(token)Headers.set("Content-Type", "application/json")
                return Headers
        }
    }),

    tagTypes: ['Login'],
    endpoints: (builder)=>({
        createLogin: builder.mutation({
            query: (newLogin) => ({
                url: 'auth/login',
                method: 'POST',
                body: newLogin,
            }),
            invalidatesTags: ['Login']
        })
    })
})

export const { useCreateLoginMutation } = apiSlice