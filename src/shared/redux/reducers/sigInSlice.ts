import { createSlice } from "@reduxjs/toolkit";
import { allForms } from "shared/modal/auth/constants";

const initState: any = {
  showModal: false,
  activeModal: allForms.signin.name,
};

export const signInSlice = createSlice({
  name: "signIn",
  initialState: initState,
  reducers: {
    setSignInReducer: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetSignInReducer: () => initState,
  },
});

export const { setSignInReducer, resetSignInReducer } = signInSlice.actions;

export default signInSlice.reducer;
