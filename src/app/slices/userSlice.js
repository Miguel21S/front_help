import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    credentials: {
        token: null,
        user: {
            name: null,
            userRole: null,
        }
    }
}

export const userSlice = createSlice(
    {
        name: "user",
        initialState,
        reducers: {
            loginUser: (state, action) => {
                state.credentials = action.payload.credentials
            },
            logoutUser: (state) => {
                state.credentials = {
                    token: null,
                    user: {
                        name: null,
                        userRole: null
                    }
                }
            }
        },
    }
)

export const { loginUser, logoutUser } = userSlice.actions;
export const userData = ( state ) => state.user;
export default userSlice.reducer