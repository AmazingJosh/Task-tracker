import { createSlice } from '@reduxjs/toolkit';

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
  },
  reducers: {
    setComments(state, action) {
      state.comments = action.payload;
    },
    clearComments(state) {
      state.comments = []; 
    },
  },
});

export const { setComments, clearComments } = commentSlice.actions;
export default commentSlice.reducer;
