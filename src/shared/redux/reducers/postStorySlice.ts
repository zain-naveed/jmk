import { createSlice } from "@reduxjs/toolkit";

const initState: any = {
  category: "",
  artCover: "",
  artTitle: "",
  artDesc: "",
  artId: null,
  contestId: null,
  wordCount: 255,
  contest: false,
  storyId: null,
  isPublic: true,
  contestEndDate: null,
  user_id: "",
};

export const postStorySlice = createSlice({
  name: "postStory",
  initialState: initState,
  reducers: {
    setStoryReducer: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetStoryReducer: () => initState,
  },
});

export const { setStoryReducer, resetStoryReducer } = postStorySlice.actions;

export default postStorySlice.reducer;
