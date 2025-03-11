// App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { AppNavigator } from './src/navigation/AppNavigator';
import { store } from './src/store/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider >
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
