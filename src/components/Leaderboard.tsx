// src/components/Leaderboard.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Player } from '../types';

interface LeaderboardProps {
  route: {
    params: {
      tournamentId: string;
    };
  };
}

const Leaderboard: React.FC<LeaderboardProps> = ({ route }) => {
  const { tournamentId } = route.params;
  const tournament = useSelector((state: RootState) =>
    state.tournament.tournaments.find(t => t.id === tournamentId)
  );

  const calculatePlayerScores = () => {
    if (!tournament) return [];

    const playerScores: { [key: string]: number } = {};
    tournament.players.forEach(player => {
      playerScores[player.id] = 0;
    });

    tournament.rounds.forEach(round => {
      round.forEach(match => {
        match.team1.players.forEach(player => {
          playerScores[player.id] += match.score.team1;
        });
        match.team2.players.forEach(player => {
          playerScores[player.id] += match.score.team2;
        });
      });
    });

    return tournament.players
      .map(player => ({
        ...player,
        score: playerScores[player.id],
      }))
      .sort((a, b) => b.score - a.score);
  };

  const renderPlayerItem = ({ item, index }: { item: Player & { score: number }, index: number }) => (
    <View style={styles.playerItem}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.playerName}>{item.name}</Text>
      <Text style={styles.playerScore}>{item.score}</Text>
    </View>
  );

  const sortedPlayers = calculatePlayerScores();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={sortedPlayers}
        renderItem={renderPlayerItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
  },
  playerName: {
    fontSize: 18,
    flex: 1,
  },
  playerScore: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 50,
    textAlign: 'right',
  },
});

export default Leaderboard;
