// App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { AppNavigator } from './src/navigation/AppNavigator';
import { store, persistor} from './src/store/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider >
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
