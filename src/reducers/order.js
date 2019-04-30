import { UPDATE_ORDER_NAME } from "../types";

export default function update(
  state = {
    orderName: null
  },
  action = {}
) {
  switch (action.type) {
    case UPDATE_ORDER_NAME:
      return {
        orderName: action.orderName
      };
    default:
      return state;
  }
}
