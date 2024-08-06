import { configureStore } from "@reduxjs/toolkit";
import alertsReducer from "../redux-slices/alertsSlice";
import userInfoReducer from "../redux-slices/userInfoSlice";
import authReducer from "../redux-slices/authSlice";
import sidebarReducer from "../redux-slices/sidebarSlice";
import checkoutReducer from "../redux-slices/checkoutSlice";

const store = configureStore({
  reducer: {
    alerts: alertsReducer,
    userInfo: userInfoReducer,
    auth: authReducer,
    sidebar: sidebarReducer,
    checkout: checkoutReducer,
  },
});

export default store;
