import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  watches: [],
  fullWatches: []
};

export const watchesSlice = createSlice({
  name: 'watches',
  initialState,
  reducers: {
    add: (state, action) => {
      state.watches.push(action.payload);
    },
    update: (state, action) => {
      state.watches.splice(action.payload.id, 1, action.payload);
    },
    initFull: (state, action) => {
      state.fullWatches = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { add, update, initFull } = watchesSlice.actions;

export default watchesSlice.reducer;
