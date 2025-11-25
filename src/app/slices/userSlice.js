import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    creadentials: {
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
                state.creadentials = action.payload.creadentials
            },
            logoutUser: (state) => {
                state.creadentials = {
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