import { createSlice } from "@reduxjs/toolkit";

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkoutItems: [],
  },
  reducers: {
    setcheckoutItem: (state, action) => {
      const existingItem = state.checkoutItems.find(item => item._id === action.payload.checkoutItem._id);
      if (!existingItem) {
        state.checkoutItems.push(action.payload.checkoutItem);
      }
    },
  },
});

export const { setcheckoutItem } = checkoutSlice.actions;
export default checkoutSlice.reducer;
