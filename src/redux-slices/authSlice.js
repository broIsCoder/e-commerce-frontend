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

// thunk to verify token and refresh token if token expires
export const verifyToken =
  (url, options = {}) =>
  async (dispatch, getState) => {
    const state = getState();
    const authToken = state.auth.authToken;
    const URL = `${import.meta.env.VITE_SERVER_URL}${url}` ;

    // browser will automatically set to formdata when uploading file
    if (!(options.body instanceof FormData)) {
      options.headers = {
        ...options.headers,
        "Content-Type": "application/json"
      };
    }

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${authToken}`,
    };

    
    let response = await fetch(URL, options);

    if (!response.ok) {
      // If authToken is expired
      if (response.status === 401) {
        // Refresh token
        const newToken = await dispatch(refreshAuthToken());
        if (newToken) {
          options.headers["Authorization"] = `Bearer ${newToken}`;
          // Request again with new token
          response = await fetch(URL, options);
        }
      }
    }
    return response;
  };

const refreshAuthToken = () => async (dispatch) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}$/refresh`, {
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
      // Dispatch logout action to update the isLoggedIn status
      dispatch(logout());
      console.log(data.message);
    }
  } catch (error) {
    // Dispatch logout action to update the isLoggedIn status
    dispatch(logout());
    console.log(error.message);
  }
  return null;
};

export default authSlice.reducer;
