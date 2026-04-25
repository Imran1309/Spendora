import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CurrencyProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </CurrencyProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
