import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {Task, TaskState} from '../../types/index.ts'



const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  filter: 'all',
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setTaskFilter: (state, action: PayloadAction<'all' | 'pending' | 'completed'>) => {
      state.filter = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.loading = false;
      state.error = null;
      state.filter = 'all';
    },
  },
});

export const { 
  setTasks, 
  setTaskFilter, 
  setLoading, 
  setError, 
  addTask, 
  updateTask, 
  deleteTask, 
  clearTasks 
} = taskSlice.actions;

export default taskSlice.reducer;
