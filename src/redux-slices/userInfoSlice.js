import { createSlice } from "@reduxjs/toolkit";

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    user: {
      cart: {
        items: [],
      },
      createdAt: "",
      email: "",
      orders: [],
      password: "",
      refreshToken: "",
      roles: { employee: null, user: null },
      updatedAt: "",
      username: "",
      __v: "",
      _id: "",
    },
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload.user;
    },
    clearUserInfo: (state) => {
      state.user = {};
    },
    updateCart: (state, action) => {
      state.user.cart.items = action.payload.cart;
    },
    updateOrder: (state, action) => {
      state.user.orders = action.payload.orders;
    },
    orderCart: (state, action) => {
      state.user.orders = [...state.user.orders, action.payload.order];
    }
  },
});

export const {
  setUserInfo,
  clearUserInfo,
  updateCart,
  updateOrder,
  orderCart,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
