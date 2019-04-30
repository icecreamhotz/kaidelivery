import { UPDATE_ORDER_MENU, UPDATE_MIN_PRICE } from "../types";

export const updateMenu = menu => dispatch => {
  dispatch({
    type: UPDATE_ORDER_MENU,
    menu
  });
};

export const updateMinPrice = minprice => dispatch => {
  dispatch({
    type: UPDATE_MIN_PRICE,
    minprice
  });
};
