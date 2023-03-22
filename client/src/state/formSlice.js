import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brand: '',
  year: '',
  model: '',
  description: '',
  serial: ''
};

export const formSlice = createSlice({
  name: 'sellForm',
  initialState,
  reducers: {
    update: (state, action) => {
      return { ...state, ...action.payload };
    }
  }
});

// Action creators are generated for each case reducer function
export const { update } = formSlice.actions;

export default formSlice.reducer;
