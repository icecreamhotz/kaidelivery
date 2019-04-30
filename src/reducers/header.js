import { TRIGGER_LOGIN_SIGNUP_BUTTON_HEADER } from "../types";

export default function locale(
  state = {
    status: false
  },
  action = {}
) {
  switch (action.type) {
    case TRIGGER_LOGIN_SIGNUP_BUTTON_HEADER:
      return {
        status: action.status
      };
    default:
      return state;
  }
}
