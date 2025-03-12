// src/types/tournament.ts

import { StackNavigationProp } from "@react-navigation/stack";

export interface Player {
  id: string;
  name: string;
  score: number
}

export interface Team {
  players: [Player, Player];
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  score: {
    team1: number;
    team2: number;
  };
}

export interface Tournament {
  id: string;
  name: string;
  courts: number;
  pointsPerMatch: number;
  players: Player[];
  rounds: Match[][];
}

// Define the navigation param list
export type RootStackParamList = {
  Home: undefined;
  TournamentSetup: undefined;
  TournamentView: { tournamentId: string };
  Leaderboard: { tournamentId: string };
};

// Define the navigation prop type for this screen
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
