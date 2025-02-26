import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true
}

export const eventReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("eventCreateRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("eventCreateSuccess", (state, action) => {
            state.isLoading = false;
            state.event = action.payload;
            state.success = true;
        }).addCase("eventCreateFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })


        // get all events of shop
        .addCase("GetAllEventsShopRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("GetAllEventsShopSuccess", (state, action) => {
            state.isLoading = false;
            state.events = action.payload;
        }).addCase("GetAllEventsShopFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        
        // get all events
        .addCase("GetAllEventsRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("GetAllEventsSuccess", (state, action) => {
            state.isLoading = false;
            state.allEvents = action.payload;
        }).addCase("GetAllEventsFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })


        // delete event of a shop
        .addCase("deleteEventRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("deleteEventSuccess", (state, action) => {
            state.isLoading = false;
            state.message = action.payload;
        }).addCase("deleteEventFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })


        .addCase("clearErrors", (state) => {
            state.error = null;
        })
})