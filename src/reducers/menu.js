import { UPDATE_ORDER_MENU } from "../types";

export default function menu(
  state = {
    menu: []
  },
  action = {}
) {
  switch (action.type) {
    case UPDATE_ORDER_MENU:
      return {
        menu: action.menu
      };
    default:
      return state;
  }
}
