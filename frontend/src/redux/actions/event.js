import axios from "axios";
import { server } from "../../server";

// create event
export const createEvent = (newForm) => async (dispatch) => {
    try {
        dispatch({
            type: "eventCreateRequest"
        });

        const config = { headers: { "Content": "multipart/form-data" } };
        const { event } = await axios.post(`${server}/event/create-event`, newForm, config);

        dispatch({
            type: "eventCreateSuccess",
            payload: event
        })

    } catch (error) {
        dispatch({
            type: "eventCreateFail",
            payload: error.response.data.message
        })
    }
}

// get all events
export const getAllEventsShop = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "GetAllEventsShopRequest"
        });

        const { data } = await axios.get(`${server}/event/get-all-events-shop/${id}`);

        dispatch({
            type: "GetAllEventsShopSuccess",
            payload: data.events
        })
    } catch (error) {
        dispatch({
            type: "GetAllEventsShopFail",
            payload: error.response.data.message
        })
    }
}

export const deleteEvent = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "deleteEventRequest"
        })

        const { data } = await axios.delete(`${server}/event/delete-shop-event/${id}`, {
            withCredentials: true
        });
        dispatch({
            type: "deleteEventSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "deleteEventFail",
            payload: error.response.data.message
        })
    }
}

  // get all events
  export const getAllEvents = () => async (dispatch) => {
    try {
      dispatch({
        type: "GetAllEventsRequest",
      });

      const {data} = await axios.get(`${server}/event/get-all-events`);
      dispatch({
        type: "GetAllEventsSuccess",
        payload: data.events,
      });
    } catch (error) {
      dispatch({
        type: "GetAllEventsFail",
        payload: error.response.data.message,
      });
    }
  }