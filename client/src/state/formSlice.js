import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: 0,
  brand: '',
  year: '',
  model: '',
  description: '',
  serial: '',
  price: 0,
  photos: [],
  address: '',
  certified: false,
  ipfsHash: undefined
};

export const formSlice = createSlice({
  name: 'sellForm',
  initialState,
  reducers: {
    update: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetForm: (state, action) => {
      state = initialState;
    }
  }
});

// Action creators are generated for each case reducer function
export const { update } = formSlice.actions;

export default formSlice.reducer;
