import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Player } from '../types';

interface Team {
  id: string;
  players: [Player, Player];
}

interface Match {
  id: string;
  team1: Team;
  team2: Team;
  score: {
    team1: number;
    team2: number;
  };
  court: number;
}

const MatchPlay: React.FC<{ route: any }> = ({ route }) => {
  const { tournamentId } = route.params;
  const tournament = useSelector((state: RootState) =>
    state.tournament.tournaments.find((t) => t.id === tournamentId)
  );
  const players = tournament?.players || [];
  const courts = tournament?.courts || 1;

  const [currentRound, setCurrentRound] = useState(1);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    if (players.length >= 4) {
      nextRound();
    }
  }, []);

  const shufflePlayers = (players: Player[]): Player[] => {
    return [...players].sort(() => Math.random() - 0.5);
  };

  const createTeams = (players: Player[]): Team[] => {
    const shuffled = shufflePlayers(players);
    const teams: Team[] = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      if (i + 1 < shuffled.length) {
        teams.push({
          id: `team-${Date.now()}-${i}`,
          players: [shuffled[i], shuffled[i + 1]]
        });
      }
    }
    return teams;
  };

  const generateRound = (players: Player[]): Match[] => {
    const teams = createTeams(players);
    const newMatches: Match[] = [];

    for (let i = 0; i < teams.length; i += 2) {
      if (i + 1 < teams.length) {
        newMatches.push({
          id: `match-${Date.now()}-${i}`,
          team1: teams[i],
          team2: teams[i + 1],
          score: { team1: 0, team2: 0 },
          court: (i / 2) % courts + 1
        });
      }
    }

    return newMatches;
  };

  const nextRound = () => {
    const newMatches = generateRound(players);
    setMatches(newMatches);
    setCurrentRound((prevRound) => prevRound + 1);
  };

  const renderMatchItem = ({ item }: { item: Match }) => (
    <View style={styles.matchItem}>
      <Text style={styles.courtText}>Court {item.court}</Text>
      <Text style={styles.matchText}>
        {item.team1.players[0].name} & {item.team1.players[1].name}
      </Text>
      <Text style={styles.matchText}>vs</Text>
      <Text style={styles.matchText}>
        {item.team2.players[0].name} & {item.team2.players[1].name}
      </Text>
      <Text style={styles.scoreText}>
        Score: {item.score.team1} - {item.score.team2}
      </Text>
    </View>
  );

  if (players.length < 4) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Not enough players for Americano Padel. Minimum 4 players required.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.roundTitle}>Round {currentRound}</Text>
      <FlatList
        data={matches}
        renderItem={renderMatchItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No matches yet. Start a new round!</Text>}
      />
      <TouchableOpacity style={styles.nextButton} onPress={nextRound}>
        <Text style={styles.nextButtonText}>Next Round</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  roundTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  matchItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  courtText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  matchText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default MatchPlay;
