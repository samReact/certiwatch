import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  watches: []
};

export const watchesSlice = createSlice({
  name: 'watches',
  initialState,
  reducers: {
    add: (state, action) => {
      state.watches.push(action.payload);
    },
    update: (state, action) => {
      const watches = state.watches.filter(
        (watch) => watch.id !== action.payload.id
      );
      watches.push(action.payload);

      return { ...state, watches };
    }
  }
});

// Action creators are generated for each case reducer function
export const { add, update } = watchesSlice.actions;

export default watchesSlice.reducer;
