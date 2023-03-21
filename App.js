import React, {useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Onboarding from './src/screen/Onboarding';
import Home from './src/screen/Home';
import NextDay from './src/screen/NextDay';
import Toast from './src/components/Toast';
const App = () => {
  const toastRef = useRef(null);
  const Stack = createStackNavigator();
  const customTransition = ({current, next, layouts}) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
        {
          translateX: next
            ? next.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -layouts.screen.width],
              })
            : 0,
        },
      ],
    },
  });

  return (
    <NavigationContainer>
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
            cardStyleInterpolator: customTransition,
            transitionSpec: {
              close: {animation: 'timing', config: {duration: 500}},
              open: {animation: 'timing', config: {duration: 500}},
            },
          }}>
          {props => <Home {...props} toast={toastRef} />}
        </Stack.Screen>
        <Stack.Screen
          name="NextDay"
          component={NextDay}
          options={{
            headerShown: false,
            cardStyleInterpolator: customTransition,
            transitionSpec: {
              close: {animation: 'timing', config: {duration: 500}},
              open: {animation: 'timing', config: {duration: 500}},
            },
          }}
        />
      </Stack.Navigator>
      <Toast ref={toastRef} />
    </NavigationContainer>
  );
};

export default App;
