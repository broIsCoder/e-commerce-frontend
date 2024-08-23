// src/features/auth/authSlice.js

import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    authToken: localStorage.getItem("authToken") || "",
  },
  reducers: {
    authenticate: (state, action) => {
      state.authToken = action.payload.authToken;
      localStorage.setItem("authToken", state.authToken);
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", state.isLoggedIn);
    },
    logout: (state) => {
      state.authToken = "";
      localStorage.removeItem("authToken");
      state.isLoggedIn = false;
      localStorage.setItem("isLoggedIn", state.isLoggedIn);
    },
  },
});

export const { authenticate, logout } = authSlice.actions;

export const verifyToken = (url, options = {}) => async (dispatch, getState) => {
  const state = getState();
  const authToken = state.auth.authToken;
  const URL = `${import.meta.env.VITE_SERVER_URL}${url}`;
  
  // Ensure params are converted to URL search params if present
  const { params, ...restOptions } = options;
  const queryString = new URLSearchParams(params).toString();
  const finalUrl = queryString ? `${URL}?${queryString}` : URL;

  // Prepare headers
  // broswer will auto switched content-typ to formdata when file are requestd to server
  if (!(restOptions.body instanceof FormData)) {
    restOptions.headers = {
      ...restOptions.headers,
      "Content-Type": "application/json",
    };
  }

  restOptions.headers = {
    ...restOptions.headers,
    Authorization: `Bearer ${authToken}`,
  };

  // Perform fetch request
  let response = await fetch(finalUrl, restOptions);

  if (!response.ok) {
    // Handle token expiration
    if (response.status === 401) {
      const newToken = await dispatch(refreshAuthToken());
      if (newToken) {
        restOptions.headers["Authorization"] = `Bearer ${newToken}`;
        response = await fetch(finalUrl, restOptions);
      }
    }
  }

  return response;
};


const refreshAuthToken = () => async (dispatch) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/refresh`, {
      method: "GET",
      credentials: "include", // Important to include cookies
    });

    // Handle server error
    if (!response.ok && response.status === 500) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success) {
      console.log(data.message);
      // Dispatch refresh action to update the authToken in the state
      dispatch(authenticate({ authToken: data.authToken }));
      return data.authToken;
    } else {
      dispatch(logout());
      console.log(data.message);
    }
  } catch (error) {
    dispatch(logout());
    console.log(error.message);
  }
  return null;
};

export default authSlice.reducer;