import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types'; 

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setAuth, clearAuth, setToken } = authSlice.actions;
export default authSlice.reducer;
