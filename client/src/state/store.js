import { configureStore } from '@reduxjs/toolkit';

import watchesSlice from './watchesSlice';
import ethSlice from './ethSlice';
import notificationSlice from './notificationSlice';
import appSlice from './appSlice';

let root = {
  watches: watchesSlice,
  eth: ethSlice,
  notification: notificationSlice,
  app: appSlice
};

export const store = configureStore({
  reducer: root,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
