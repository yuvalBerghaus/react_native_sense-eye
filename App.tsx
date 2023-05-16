import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import MentorMainScreen from './MentorMainScreen';
import MentorMyListScreen from './MentorMyListScreen';
import GameDetailScreen from './GameDetailScreen';

const Stack = createStackNavigator();

const App = (): JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="MentorMyListScreen" component={MentorMyListScreen} />
        <Stack.Screen name="MentorMainScreen" component={MentorMainScreen} />
        <Stack.Screen name="GameDetailScreen" component={GameDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
};

export default App;
