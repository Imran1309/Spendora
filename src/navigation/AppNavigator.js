import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerifyOTPScreen from '../screens/auth/VerifyOTPScreen';
import DashboardScreen from '../screens/main/DashboardScreen';
import AddExpenseScreen from '../screens/expense/AddExpenseScreen';
import EditExpenseScreen from '../screens/expense/EditExpenseScreen';
import CurrencyScreen from '../screens/settings/CurrencyScreen';

const Stack = createNativeStackNavigator();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    text: colors.textPrimary,
  },
};

import { AuthContext } from '../context/AuthContext';

export const AppNavigator = () => {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    return null; // Or a splash screen
  }

  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={DashboardScreen} />
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
              <Stack.Screen name="EditExpense" component={EditExpenseScreen} />
              <Stack.Screen name="Currency" component={CurrencyScreen} />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
