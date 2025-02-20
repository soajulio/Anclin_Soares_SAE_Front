import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from './Screen/AppNavigator';
import ConnectionScreen from './Screen/ConnectionScreen';
import HistoriqueScreen from './Screen/HistoriqueScreen';
import { AuthProvider } from './components/AuthContext';   

export default function App() {
  const Stack = createStackNavigator();

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="AppNavigator"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="AppNavigator" component={AppNavigator} />
          <Stack.Screen name="Connexion" component={ConnectionScreen} />
          <Stack.Screen name="Historique" component={HistoriqueScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
