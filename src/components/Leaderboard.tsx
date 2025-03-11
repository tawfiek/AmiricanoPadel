import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Player } from '../types';

const Leaderboard: React.FC = () => {
  const players = useSelector((state: RootState) => state.players);
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <View>
      <FlatList
        data={sortedPlayers}
        renderItem={({ item, index }: { item: Player; index: number }) => (
          <Text>{`${index + 1}. ${item.name}: ${item.score} points`}</Text>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default Leaderboard;
