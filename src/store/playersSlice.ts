import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player } from '../types';

const playersSlice = createSlice({
  name: 'players',
  initialState: [] as Player[],
  reducers: {
    addPlayer: (state, action: PayloadAction<{ name: string }>) => {
      state.push({
        id: Date.now().toString(),
        name: action.payload.name,
        score: 0,
      });
    },
    updatePlayerScore: (state, action: PayloadAction<{ id: string; score: number }>) => {
      const player = state.find(p => p.id === action.payload.id);
      if (player) {
        if (!player.score) player.score = action.payload.score;
        player.score += action.payload.score;
      }
    },
  },
});

export const { addPlayer, updatePlayerScore } = playersSlice.actions;
export default playersSlice.reducer;
