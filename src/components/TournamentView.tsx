import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateMatchScore } from '../store/tournamentSlice';
import { RootState } from '../store/store';
import { HomeScreenNavigationProp, Match } from '../types';
import { useNavigation } from '@react-navigation/native';

const TournamentView: React.FC<{ route: { params: { tournamentId: string } } }> = ({ route }) => {
  const { tournamentId } = route.params;
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const tournament = useSelector((state: RootState) => 
    state.tournament.tournaments.find(t => t.id === tournamentId)
  );
  const dispatch = useDispatch();
  const [currentRound, setCurrentRound] = useState(0);
  const [editingScore, setEditingScore] = useState<{ matchId: string, team: 'team1' | 'team2' } | null>(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Leaderboard', { tournamentId })}
          style={styles.leaderboardButton}
        >
          <Text style={styles.leaderboardButtonText}>Leaderboard</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, tournamentId]);

  const handleScoreUpdate = (matchId: string, team: 'team1' | 'team2', newScore: number) => {
    if (!tournament) return;

    const match = tournament.rounds[currentRound].find(m => m.id === matchId);
    if (!match) return;

    if (newScore < 0 || newScore > tournament.pointsPerMatch) {
      Alert.alert('Error', `Score must be between 0 and ${tournament.pointsPerMatch}`);
      return;
    }

    const otherTeam = team === 'team1' ? 'team2' : 'team1';
    const otherTeamScore = tournament.pointsPerMatch - newScore;

    dispatch(updateMatchScore({ 
      tournamentId, 
      roundIndex: currentRound, 
      matchId, 
      team1Score: team === 'team1' ? newScore : otherTeamScore,
      team2Score: team === 'team2' ? newScore : otherTeamScore
    }));

    setEditingScore(null);
  };

  const renderMatch = ({ item }: { item: Match }) => (
    <View style={styles.matchItem}>
      <Text>{`${item.team1.players[0].name} & ${item.team1.players[1].name} vs ${item.team2.players[0].name} & ${item.team2.players[1].name}`}</Text>
      <View style={styles.scoreContainer}>
        <View style={styles.teamScore}>
          {editingScore?.matchId === item.id && editingScore?.team === 'team1' ? (
            <TextInput
              style={styles.scoreInput}
              keyboardType="numeric"
              defaultValue={item.score.team1.toString()}
              onSubmitEditing={(e) => handleScoreUpdate(item.id, 'team1', parseInt(e.nativeEvent.text, 10))}
              autoFocus
            />
          ) : (
            <TouchableOpacity onPress={() => setEditingScore({ matchId: item.id, team: 'team1' })}>
              <Text style={styles.score}>{item.score.team1}</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.scoreSeparator}>-</Text>
        <View style={styles.teamScore}>
          {editingScore?.matchId === item.id && editingScore?.team === 'team2' ? (
            <TextInput
              style={styles.scoreInput}
              keyboardType="numeric"
              defaultValue={item.score.team2.toString()}
              onSubmitEditing={(e) => handleScoreUpdate(item.id, 'team2', parseInt(e.nativeEvent.text, 10))}
              autoFocus
            />
          ) : (
            <TouchableOpacity onPress={() => setEditingScore({ matchId: item.id, team: 'team2' })}>
              <Text style={styles.score}>{item.score.team2}</Text>
            </TouchableOpacity>
          )}
        </View>
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
  teamScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  scoreInput: {
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 5,
    padding: 5,
    width: 50,
    textAlign: 'center',
  },
  scoreSeparator: {
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
    leaderboardButton: {
        marginRight: 10,
    },
    leaderboardButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TournamentView;
