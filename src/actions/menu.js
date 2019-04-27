import { UPDATE_ORDER_MENU } from "../types";

export const updateMenu = menu => dispatch => {
  dispatch({
    type: UPDATE_ORDER_MENU,
    menu
  });
};
