import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Match, Tournament } from '../types';

interface TournamentState {
  tournaments: Tournament[];
}

const initialState: TournamentState = {
  tournaments: []
};

const tournamentSlice = createSlice({
  name: 'tournament',
  initialState,
  reducers: {
    addTournament: (state, action: PayloadAction<Tournament>) => {
      state.tournaments.push(action.payload);
    },
    updateMatchScore: (state, action: PayloadAction<{
      tournamentId: string;
      roundIndex: number;
      matchId: string;
      team: 'team1' | 'team2';
    }>) => {
      const { tournamentId, roundIndex, matchId, team } = action.payload;
      const tournament = state.tournaments.find((t: Tournament) => t.id === tournamentId);
      if (tournament) {
        const match = tournament.rounds[roundIndex].find((m: Match) => m.id === matchId);
        if (match) {
          match.score[team]++;
        }
      }
    }
  }
});

export const { addTournament, updateMatchScore } = tournamentSlice.actions;
export default tournamentSlice.reducer;
