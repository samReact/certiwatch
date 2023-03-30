import { createSlice } from '@reduxjs/toolkit';
import { useAccount, useContractRead } from 'wagmi';

const initialState = {
  expertEvents: []
};

export const formSlice = createSlice({
  name: 'eth',
  initialState,
  reducers: {
    init: (state, action) => {
      return { ...state, ...action.payload };
    }
  }
});

// Action creators are generated for each case reducer function
export const { init } = formSlice.actions;

export default formSlice.reducer;
