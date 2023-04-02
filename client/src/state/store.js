import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import watchesSlice from './watchesSlice';
import ethSlice from './ethSlice';
import notificationSlice from './notificationSlice';
import appSlice from './appSlice';
import stepperReducer from './stepperSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['notification', 'eth']
};

let root = combineReducers({
  stepper: stepperReducer,
  watches: watchesSlice,
  eth: ethSlice,
  notification: notificationSlice,
  app: appSlice
});

const persistedReducer = persistReducer(persistConfig, root);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
