import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    wishlist: localStorage.getItem("wishlistItems") ? JSON.parse(localStorage.getItem("wishlistItems")) : []
};

export const wishlistReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("addToWishlist", (state, action) => {
            const item = action.payload;
            const isItemExist = state.wishlist.find((i) => i._id === item._id);
            if (isItemExist) {
                return {
                    ...state,
                    wishlist: state.wishlist.map((i) => (i._id === item._id ? item : i))
                }
            } else {
                return {
                    ...state,
                    wishlist: [...state.wishlist, item]
                }
            }
        })
        .addCase("removeFromWishlist", (state, action) => {
            return {
                ...state,
                wishlist: state.wishlist.filter((i) => i._id !== action.payload)
            }
        })
})