import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './pages/Home';
import Calcular from './pages/Calcular';
import AddProdutos from './pages/AddProdutos';
import Salvos from './pages/Salvos';
import Info from './pages/Info';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />

        <Stack.Screen name="Calcular" component={Calcular} options={{ headerShown: false }} />

        <Stack.Screen name="Adicionar" component={AddProdutos} options={{ headerShown: false }} />

        <Stack.Screen name="Salvos" component={Salvos} options={{ headerShown: false }} />

        <Stack.Screen name="Info" component={Info} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}