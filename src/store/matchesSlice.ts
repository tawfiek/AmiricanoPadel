import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of a player
interface Player {
  id: string;
  name: string;
}

// Define the shape of a match
interface Match {
  id: string;
  team1: Player[];
  team2: Player[];
  team1Score: number;
  team2Score: number;
  isCompleted: boolean;
}

// Define the shape of the matches state
interface MatchesState {
  matches: Match[];
  currentMatchId: string | null;
}

// Define the initial state
const initialState: MatchesState = {
  matches: [],
  currentMatchId: null,
};

// Create the slice
const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    // Action to add a new match
    addMatch: (state, action: PayloadAction<{ team1: Player[]; team2: Player[] }>) => {
      const newMatch: Match = {
        id: Date.now().toString(),
        team1: action.payload.team1,
        team2: action.payload.team2,
        team1Score: 0,
        team2Score: 0,
        isCompleted: false,
      };
      state.matches.push(newMatch);
    },
    // Action to record match result
    recordMatchResult: (state, action: PayloadAction<{ matchId: string; team1Score: number; team2Score: number }>) => {
      const match = state.matches.find(m => m.id === action.payload.matchId);
      if (match) {
        match.team1Score = action.payload.team1Score;
        match.team2Score = action.payload.team2Score;
        match.isCompleted = true;
      }
    },
    // Action to set the current match
    setCurrentMatch: (state, action: PayloadAction<string>) => {
      state.currentMatchId = action.payload;
    },
    // Action to clear all matches (e.g., when starting a new tournament)
    clearMatches: (state) => {
      state.matches = [];
      state.currentMatchId = null;
    },
  },
});

// Export actions
export const { addMatch, recordMatchResult, setCurrentMatch, clearMatches } = matchesSlice.actions;

// Export reducer
export default matchesSlice.reducer;

// Selectors
export const selectAllMatches = (state: { matches: MatchesState }) => state.matches.matches;
export const selectCurrentMatch = (state: { matches: MatchesState }) => 
  state.matches.matches.find(match => match.id === state.matches.currentMatchId);
export const selectCompletedMatches = (state: { matches: MatchesState }) => 
  state.matches.matches.filter(match => match.isCompleted);
