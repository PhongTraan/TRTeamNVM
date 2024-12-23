import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },
  reducers: {
    //Register
    registerRequest(state) {
      state.isLoading = true;
      state.isError = false;
    },
    registerSuccess(state, action) {
      state.isLoading = false;
      state.data = action.payload;
    },
    registerFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },

    //Login
    loginRequest(state) {
      state.isLoading = true;
      state.isError = false;
    },
    loginSuccess(state, action) {
      state.isLoading = false;
      state.data = action.payload;
    },
    loginFailure(state) {
      state.isLoading = false;
      state.isError = true;
    },

    //LogOut
    logout(state) {
      state.data = null;
    },
  },
});

export const {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
