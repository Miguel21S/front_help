import { createSlice } from "@reduxjs/toolkit"
import { logoutUser } from "./userSlice"

const initialState = {
    criteria: ""
}

export const profileSlice = createSlice(
    {
        name: "profile",
        initialState,
        reducers: {
            updateCriteria: (state, action) => {
                state.criteria = action.payload.criteria
            },

            logoutReducer: (builder) => {
                builder.addCase(logoutUser, () => {
                    return initialState
                })
            }
        }
    }
)

export const { updateCriteria, logoutReducer } = profileSlice.actions;
export const profileData = (state) => state.profile;
export default profileSlice.reducer;