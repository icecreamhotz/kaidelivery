import { TRIGGER_LOGIN_SIGNUP_BUTTON_HEADER } from "../types";

export const triggerLoginSignupHeader = status => dispatch => {
  dispatch({
    type: TRIGGER_LOGIN_SIGNUP_BUTTON_HEADER,
    status
  });
};
