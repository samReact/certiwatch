import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: undefined,
  type: undefined,
  description: undefined
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      return { ...state, ...action.payload };
    }
  }
});

export const { addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
