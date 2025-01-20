import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isSeller: false,
    isLoading: false,
    error: null,
    seller: null
};

export const sellerReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("LoadSellerRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("LoadSellerSuccess", (state, action) => {
            state.isLoading = false;
            state.isSeller = true;
            state.seller = action.payload;
        })
        .addCase("LoadSellerFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.isSeller = false;
        })
        .addCase("clearErrors", (state) => {
            state.error = null;
        });
});
