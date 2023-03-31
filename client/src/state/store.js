import { configureStore } from '@reduxjs/toolkit';
import stepperReducer from './stepperSlice';
import watchesSlice from './watchesSlice';
import ethSlice from './ethSlice';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import notificationSlice from './notificationSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['notification']
};

let root = combineReducers({
  stepper: stepperReducer,
  watches: watchesSlice,
  eth: ethSlice,
  notification: notificationSlice
});

const persistedReducer = persistReducer(persistConfig, root);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});
