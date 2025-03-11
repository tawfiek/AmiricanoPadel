import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../store/store';
import { HomeScreenNavigationProp, Tournament } from '../types';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const tournaments = useSelector((state: RootState) => state.tournament.tournaments);

  const renderTournamentItem = ({ item }: { item: Tournament }) => (
    <TouchableOpacity
      style={styles.tournamentItem}
      onPress={() => navigation.navigate('TournamentView', { tournamentId: item.id })}
    >
      <Text style={styles.tournamentName}>{item.name}</Text>
      <Text>Courts: {item.courts}</Text>
      <Text>Points per Match: {item.pointsPerMatch}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tournaments</Text>
      <FlatList
        data={tournaments}
        renderItem={renderTournamentItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No tournaments yet. Add one to get started!</Text>}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('TournamentSetup')}
      >
        <Text style={styles.addButtonText}>Add New Tournament</Text>
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
  tournamentItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
