import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tournamentReducer from './tournamentSlice';
import playersReducer from './playersSlice';
import matchesReducer from './matchesSlice';

// Define the persisted state type
export interface RootState {
  tournament: ReturnType<typeof tournamentReducer>;
  matches: ReturnType<typeof matchesReducer>;
  players: ReturnType<typeof playersReducer>;
}

const rootReducer = combineReducers({
    players: playersReducer,
    matches: matchesReducer,
    tournament: tournamentReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
