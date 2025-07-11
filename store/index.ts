import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import flightReducer from './slices/flightSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer.reducer,
    flight: flightReducer.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
