import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in these paths
        ignoredActions: ['auth/setTokens', 'persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['auth.tokens'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
