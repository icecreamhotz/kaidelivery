import { combineReducers } from "redux";

import user from "./reducers/user";
import locale from "./reducers/locale";
import update from "./reducers/update";
import menu from "./reducers/menu";
import header from "./reducers/header";
import order from "./reducers/order";

export default combineReducers({
  user,
  locale,
  update,
  menu,
  header,
  order
});
