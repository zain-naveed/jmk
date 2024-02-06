import { createSlice } from "@reduxjs/toolkit";

const initState: any = {
  stories: [],
};

export const storiesSlice = createSlice({
  name: "stories",
  initialState: initState,
  reducers: {
    setStoriesReducer: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetStoriesReducer: () => initState,
  },
});

export const { setStoriesReducer, resetStoriesReducer } = storiesSlice.actions;

export default storiesSlice.reducer;
