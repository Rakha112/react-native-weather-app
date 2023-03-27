/* eslint-disable react-native/no-inline-styles */
import {StatusBar} from 'react-native';
import React, {useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Onboarding from './src/screen/Onboarding';
import Home from './src/screen/Home';
import NextDay from './src/screen/NextDay';
import Toast from './src/components/Toast';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RNBootSplash from 'react-native-bootsplash';
const App = () => {
  const toastRef = useRef(null);
  const Stack = createStackNavigator();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle="dark-content"
      />
      <NavigationContainer
        onReady={() => RNBootSplash.hide({fade: true, duration: 500})}>
        <Stack.Navigator initialRouteName="Onboarding">
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Home"
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}>
            {props => <Home {...props} toast={toastRef} />}
          </Stack.Screen>
          <Stack.Screen
            name="NextDay"
            component={NextDay}
            options={{
              title: 'Next 7 Days',
              headerStyle: {
                backgroundColor: '#C4E2FE',
              },
              headerTintColor: '#505A7D',
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast ref={toastRef} />
    </GestureHandlerRootView>
  );
};

export default App;
