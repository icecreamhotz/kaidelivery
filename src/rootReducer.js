import { combineReducers } from "redux";

import user from "./reducers/user";
import locale from "./reducers/locale";
import update from "./reducers/update";
import menu from "./reducers/menu";

export default combineReducers({
  user,
  locale,
  update,
  menu
});
