// src/components/PlayerManagement.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addPlayer } from '../store/playersSlice';
import { RootState } from '../store/store';
import { Player } from '../types';

const PlayerManagement: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const dispatch = useDispatch();
  const players = useSelector((state: RootState) => state.players);

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      dispatch(addPlayer({ name: playerName.trim() }));
      setPlayerName('');
    }
  };

  return (
    <View>
      <TextInput
        value={playerName}
        onChangeText={setPlayerName}
        placeholder="Enter player name"
      />
      <Button title="Add Player" onPress={handleAddPlayer} />
      <FlatList
        data={players}
        renderItem={({ item }: { item: Player }) => <Text>{item.name}</Text>}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default PlayerManagement
