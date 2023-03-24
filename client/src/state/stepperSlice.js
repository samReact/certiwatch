import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0
};

export const stepperSlice = createSlice({
  name: 'stepper',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    resetStep: (state) => {
      state.value = 0;
    }
  }
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount, resetStep } =
  stepperSlice.actions;

export default stepperSlice.reducer;
