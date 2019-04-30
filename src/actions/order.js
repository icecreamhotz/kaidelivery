import { UPDATE_ORDER_NAME } from "../types";

export const updateOrderName = orderName => dispatch => {
  dispatch({
    type: UPDATE_ORDER_NAME,
    orderName
  });
};
