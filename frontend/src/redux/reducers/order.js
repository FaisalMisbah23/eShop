import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const orderReducer = createReducer(initialState, (builder) => {
  builder

    // get all orders of a user
    .addCase("GetAllOrdersUserRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("GetAllOrdersUserSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase("GetAllOrdersUserFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // get all orders of a shop
    .addCase("GetAllOrdersShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("GetAllOrdersShopSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase("GetAllOrdersShopFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // get all orders for admin
    .addCase("AdminAllOrdersRequest", (state) => {
      state.adminOrderLoading = true;
    })
    .addCase("AdminAllOrdersSuccess", (state, action) => {
      state.adminOrderLoading = false;
      state.adminOrders = action.payload;
    })
    .addCase("AdminAllOrdersFail", (state, action) => {
      state.adminOrderLoading = false;
      state.error = action.payload;
    })

    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
