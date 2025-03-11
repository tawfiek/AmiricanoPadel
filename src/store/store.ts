import { configureStore } from '@reduxjs/toolkit';
import playersReducer from './playersSlice';
import matchesReducer from './matchesSlice';
import tournamentReducer from './tournamentSlice';

export const store = configureStore({
  reducer: {
    players: playersReducer,
    matches: matchesReducer,
    tournament: tournamentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
