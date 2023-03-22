import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  PermissionsAndroid,
  Alert,
  Linking,
  Platform,
  Image,
} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Button from '../components/Button';
import {useNavigation} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
const Onboarding = () => {
  const {width, height} = useWindowDimensions();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    changeNavigationBarColor('#C4E2FE', true, false);
  }, []);

  const pressHandler = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          navigation.replace('Home');
        } else {
          Alert.alert(
            'Whater App',
            'Weather app would like to access your location',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => Linking.openSettings(),
              },
            ],
          );
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      Geolocation.requestAuthorization('always').then(e => {
        if (e === 'granted') {
          navigation.replace('Home');
        } else {
          Alert.alert(
            'Whater App',
            'Weather app would like to access your location',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => Linking.openSettings(),
              },
            ],
          );
        }
      });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/images/OnboardingImage.png')}
        style={[
          styles.image,
          {
            width: width * 0.7,
            height: width * 0.7,
          },
        ]}
      />
      <View
        style={[
          styles.bottom,
          {
            width: width * 0.9,
            height: height * 0.4,
          },
        ]}>
        <View>
          <Text style={styles.title}>Weather App</Text>
          <Text style={styles.text}>Dicover the weather in your city</Text>
          <Text style={styles.text}>and around the world</Text>
        </View>
        <Button text={'Get Started'} pressHandler={pressHandler} />
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4E2FE',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    resizeMode: 'center',
    maxWidth: 300,
  },
  bottom: {
    backgroundColor: 'white',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'space-around',
    maxWidth: 500,
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  text: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
  },
});
