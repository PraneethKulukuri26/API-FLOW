import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './features/projectSlice';
// Import reducers here when created

export const store = configureStore({
  reducer: {
    project: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 