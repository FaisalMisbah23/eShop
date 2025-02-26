import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true
}

export const productReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("productCreateRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("productCreateSuccess", (state, action) => {
            state.isLoading = false;
            state.product = action.payload;
            state.success = true;
        }).addCase("productCreateFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })


        // get all products of shop
        .addCase("GetAllProductsShopRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("GetAllProductsShopSuccess", (state, action) => {
            state.isLoading = false;
            state.products = action.payload;
        }).addCase("GetAllProductsShopFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // get all products
        .addCase("GetAllProductsRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("GetAllProductsSuccess", (state, action) => {
            state.isLoading = false;
            state.allProducts = action.payload;
        }).addCase("GetAllProductsFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })


        // delete product of a shop
        .addCase("deleteProductRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("deleteProductSuccess", (state, action) => {
            state.isLoading = false;
            state.message = action.payload;
        }).addCase("deleteProductFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })


        .addCase("clearErrors", (state) => {
            state.error = null;
        })
})