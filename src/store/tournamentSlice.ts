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
      team1Score: number;
      team2Score: number;
    }>) => {
      const { tournamentId, roundIndex, matchId, team1Score, team2Score } = action.payload;
      const tournament = state.tournaments.find(t => t.id === tournamentId);
      if (tournament) {
        const match = tournament.rounds[roundIndex].find(m => m.id === matchId);
        if (match) {
          match.score.team1 = team1Score;
          match.score.team2 = team2Score;
        }
      }
    }


  }
});

export const { addTournament, updateMatchScore } = tournamentSlice.actions;
export default tournamentSlice.reducer;
