import axios from "axios";
import { server } from "../../server";

// get all sellers for admin
export const getAllSellers = () => async (dispatch) => {
  try {
    dispatch({
      type: "GetAllSellersRequest",
    });

    const { data } = await axios.get(`${server}/shop/admin-all-sellers`, {
      withCredentials: true,
    });

    dispatch({
      type: "GetAllSellersSuccess",
      payload: data.sellers,
    });
  } catch (error) {
    dispatch({
      type: "GetAllSellersFail",
      //   payload: error.response.data.message,
    });
  }
};
