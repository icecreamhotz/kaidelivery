import { UPDATE_ORDER_TEL } from "../types";

export default function update(
  state = {
    orderTel: null
  },
  action = {}
) {
  switch (action.type) {
    case UPDATE_ORDER_TEL:
      return {
        orderTel: action.orderTel
      };
    default:
      return state;
  }
}
