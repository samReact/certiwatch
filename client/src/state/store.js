import { configureStore } from '@reduxjs/toolkit';
import stepperReducer from './stepperSlice';
import sellFormReducer from './formSlice';

export const store = configureStore({
  reducer: {
    stepper: stepperReducer,
    sellForm: sellFormReducer
  }
});
