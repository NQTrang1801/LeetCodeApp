import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LeetCodeApp from './LeetCodeApp';
import ProblemDetailScreen from './ProblemDetailScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LeetCode" component={LeetCodeApp} />
        <Stack.Screen name="ProblemDetail" component={ProblemDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
