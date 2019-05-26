import { UPDATE_ORDER_TEL } from "../types";

export const updateOrderTel = orderTel => dispatch => {
  dispatch({
    type: UPDATE_ORDER_TEL,
    orderTel
  });
};
