// src/components/TournamentView.tsx

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateMatchScore } from '../store/tournamentSlice';
import { RootState } from '../store/store';
import { Match } from '../types';

const TournamentView: React.FC<{ route: any}> = ({ route }) => {
  const { tournamentId } = route.params;
  const tournament = useSelector((state: RootState) => 
    state.tournament.tournaments.find(t => t.id === tournamentId)
  );
  const dispatch = useDispatch();
  const [currentRound, setCurrentRound] = useState(0);

  const handleScoreUpdate = (matchId: string, team: 'team1' | 'team2') => {
    dispatch(updateMatchScore({ tournamentId, roundIndex: currentRound, matchId, team }));
  };

  const renderMatch = ({ item }: { item: Match }) => (
    <View style={styles.matchItem}>
      <Text>{`${item.team1.players[0].name} & ${item.team1.players[1].name} vs ${item.team2.players[0].name} & ${item.team2.players[1].name}`}</Text>
      <View style={styles.scoreContainer}>
        <TouchableOpacity onPress={() => handleScoreUpdate(item.id, 'team1')}>
          <Text style={styles.scoreButton}>+</Text>
        </TouchableOpacity>
        <Text style={styles.score}>{item.score.team1} - {item.score.team2}</Text>
        <TouchableOpacity onPress={() => handleScoreUpdate(item.id, 'team2')}>
          <Text style={styles.scoreButton}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!tournament) {
    return <Text>Tournament not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tournament.name}</Text>
      <Text style={styles.roundTitle}>Round {currentRound + 1}</Text>
      <FlatList
        data={tournament.rounds[currentRound]}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity 
        style={styles.nextButton}
        onPress={() => setCurrentRound((prev) => (prev + 1) % tournament.rounds.length)}
      >
        <Text style={styles.buttonText}>Next Round</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  roundTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  matchItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  scoreButton: {
    fontSize: 24,
    paddingHorizontal: 15,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TournamentView;
