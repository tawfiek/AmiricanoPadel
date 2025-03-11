import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addTournament } from '../store/tournamentSlice';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp, Match, Player, Tournament } from '../types';

/**
 * 
 *
 
 // Define the navigation prop type for this screen
 type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
 
 const HomeScreen: React.FC = () => {
   const navigation = useNavigation<HomeScreenNavigationProp>();
 */
const TournamentSetup: React.FC<{ route: any }> = () => {
  const [name, setName] = useState('');
  const [courts, setCourts] = useState('1');
  const [pointsPerMatch, setPointsPerMatch] = useState('32');
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const dispatch = useDispatch();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Add a player to the list
  const addPlayer = () => {
    if (playerName.trim()) {
      setPlayers([...players, { id: Date.now().toString(), name: playerName.trim(), score: 0 }]);
      setPlayerName('');
    }
  };

  // Remove a player from the list
  const removePlayer = (id: string) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  const generateRounds = (players: Player[]): Match[][] => {
    const rounds: Match[][] = [];
    const n = players.length;
    const totalRounds = n - 1;

    for (let round = 0; round < totalRounds; round++) {
      const matches: Match[] = [];
      const shuffledPlayers = shufflePlayers([...players]);

      for (let i = 0; i < n / 2; i++) {
        matches.push({
          id: `match-${round}-${i}`,
          team1: { players: [shuffledPlayers[i], shuffledPlayers[n - 1 - i]] },
          team2: { players: [shuffledPlayers[i + 1], shuffledPlayers[n - 2 - i]] },
          score: { team1: 0, team2: 0 }
        });
      }
      rounds.push(matches);
    }
    return rounds;
  };

  const shufflePlayers = (players: Player[]): Player[] => {
    return [...players].sort(() => Math.random() - 0.5);
  };

  const handleCreateTournament = () => {
    if (name.trim() === '' || parseInt(courts) < 1 || players.length < 4 || parseInt(pointsPerMatch) < 1) {
      Alert.alert('Error', 'Please ensure all fields are filled correctly');
      return;
    }

    const rounds = generateRounds(players);
    const newTournament: Tournament = {
      id: Date.now().toString(),
      name: name.trim(),
      courts: parseInt(courts),
      pointsPerMatch: parseInt(pointsPerMatch),
      players: players,
      rounds: rounds
    };

    dispatch(addTournament(newTournament));
    navigation.navigate('TournamentView', { tournamentId: newTournament.id });
  };



  // Render individual player items in the list
  const renderPlayerItem = ({ item }: { item: Player }) => (
    <View style={styles.playerItem}>
      <Text>{item.name}</Text>
      <TouchableOpacity onPress={() => removePlayer(item.id)}>
        <Text style={styles.removeButton}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tournament Name Input */}
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Tournament Name"
      />

      {/* Number of Courts Input */}
      <TextInput
        style={styles.input}
        value={courts}
        onChangeText={setCourts}
        placeholder="Number of courts"
        keyboardType="numeric"
      />

      {/* Points Per Match Input */}
      <TextInput
        style={styles.input}
        value={pointsPerMatch}
        onChangeText={setPointsPerMatch}
        placeholder="Points per match"
        keyboardType="numeric"
      />

      {/* Player Input */}
      <View style={styles.playerInputContainer}>
        <TextInput
          style={styles.playerInput}
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="Player Name"
        />
        <TouchableOpacity style={styles.addPlayerButton} onPress={addPlayer}>
          <Text style={styles.buttonText}>Add Player</Text>
        </TouchableOpacity>
      </View>

      {/* Player List */}
      <FlatList
        data={players}
        renderItem={renderPlayerItem}
        keyExtractor={(item) => item.id}
        style={styles.playerList}
      />

      {/* Create Tournament Button */}
      <TouchableOpacity
        style={[styles.createButton, players.length < 4 && styles.disabledButton]}
        onPress={handleCreateTournament}
        disabled={players.length < 4 || parseInt(pointsPerMatch) <= 0 || parseInt(courts) <= 0 || name.trim() === ''}
      >
        <Text style={styles.buttonText}>Create Tournament</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  playerInputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  playerInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addPlayerButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  playerList: {
    maxHeight: '50%',
    marginBottom: 20,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  removeButton: {
    color: 'red',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 'auto',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TournamentSetup;
