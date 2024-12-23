import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
    selectedUser: null,
  },
  reducers: {
    getAllUserStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    getAllUserSuccess(state, action) {
      state.isLoading = false;
      state.data = action.payload;
    },
    getAllUserFalse(state) {
      state.isLoading = false;
      state.isError = true;
    },

    getDetailsUserIdStart(state) {
      state.isLoading = true;
      state.isError = false;
    },
    getDetailsUserIdSuccess(state, action) {
      state.isLoading = false;
      state.selectedUser = action.payload;
    },
    getDetailsUserIdFalse(state) {
      state.isLoading = false;
      state.isError = true;
      state.selectedUser = null;
    },
  },
});

export const {
  getAllUserStart,
  getAllUserSuccess,
  getAllUserFalse,
  getDetailsUserIdStart,
  getDetailsUserIdSuccess,
  getDetailsUserIdFalse,
} = userSlice.actions;

export default userSlice.reducer;
