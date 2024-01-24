import { createSlice } from "@reduxjs/toolkit"

const initialState={
    value:true
}

const LoadingSlice = createSlice({
    name:"loading",
    initialState,
    reducers:{
        sliceLoading:(state,action)=>{
            state.value=action.payload
        }
    }
})

export const {sliceLoading} = LoadingSlice.actions
export default LoadingSlice.reducer