import { configureStore } from '@reduxjs/toolkit';
import stepperReducer from './stepperSlice';
import sellFormReducer from './formSlice';
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

const persistConfig = {
  key: 'root',
  version: 1,
  storage
};

let root = combineReducers({
  stepper: stepperReducer,
  sellForm: sellFormReducer,
  watches: watchesSlice,
  eth: ethSlice
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
