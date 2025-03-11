// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PlayerManagement from '../components/PlayerManagement';
import Leaderboard  from '../components/Leaderboard';
import MatchPlay from '../components/MatchPlay';
import HomeScreen from '../components/homescreen';
import TournamentView from '../components/TournamentView';
import TournamentSetup from '../components/TournamentSetup';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PlayerManagement" component={PlayerManagement} />
        <Stack.Screen name="TournamentSetup" component={TournamentSetup} />
        <Stack.Screen name="TournamentView" component={TournamentView} />
        <Stack.Screen name="MatchPlay" component={MatchPlay} />
        <Stack.Screen name="Leaderboard" component={Leaderboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
