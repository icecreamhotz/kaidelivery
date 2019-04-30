import { UPDATE_ORDER_MENU, UPDATE_MIN_PRICE } from "../types";

export default function menu(
  state = {
    menu: [],
    minPrice: null
  },
  action = {}
) {
  switch (action.type) {
    case UPDATE_ORDER_MENU:
      return {
        ...state,
        menu: action.menu
      };
    case UPDATE_MIN_PRICE:
      return {
        ...state,
        minPrice: action.minprice
      };
    default:
      return state;
  }
}
