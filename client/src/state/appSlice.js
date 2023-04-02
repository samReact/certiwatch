import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  feeRate: 0,
  form: {}
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateFeeRate: (state, action) => {
      return { ...state, feeRate: action.payload };
    },
    updateForm: (state, action) => {
      return { ...state, form: { ...state.form, ...action.payload } };
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateFeeRate, updateForm } = appSlice.actions;

export default appSlice.reducer;
