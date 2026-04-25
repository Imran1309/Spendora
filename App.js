import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { CurrencyProvider } from './src/context/CurrencyContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <CurrencyProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </CurrencyProvider>
    </SafeAreaProvider>
  );
}
