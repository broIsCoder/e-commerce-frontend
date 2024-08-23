import { createSlice } from "@reduxjs/toolkit";

export const alertsSlice = createSlice({
  name: "alerts",
  initialState: {
    alertsList: [],
  },
  reducers: {
    addAlert: (state, action) => {
      const id = new Date().getTime();
      const newAlert = {
        id,
        message: action.payload.message,
        type: action.payload.type,
        exiting: false,
      };

      if (state.alertsList.length >= 5) {
        const excessCount = state.alertsList.length - 5 + 1;
        state.alertsList.splice(0, excessCount);
      }

      state.alertsList.push(newAlert);
    },
    markAlertExiting: (state, action) => {
      const alert = state.alertsList.find(
        (alert) => alert.id === action.payload.id
      );
      if (alert) {
        alert.exiting = true;
      }
    },
    removeAlert: (state, action) => {
      state.alertsList = state.alertsList.filter(
        (alert) => alert.id !== action.payload.id
      );
    },
  },
});

export const { addAlert, markAlertExiting, removeAlert } = alertsSlice.actions;

export const removeAlertWithDelay = (id) => (dispatch) => {
  dispatch(markAlertExiting({ id }));
  setTimeout(() => {
    dispatch(removeAlert({ id }));
  }, 500);
};

export default alertsSlice.reducer;
