import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import taskReducer from "./slices/taskSlice.ts"

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
