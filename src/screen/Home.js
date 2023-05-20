import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  Pressable,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useEffect, useState, useCallback} from 'react';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {OPENWEATHER_KEY, HEREMAP_KEY} from '@env';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import getImage from '../utilities/getImage';
import Card from '../components/Card';
import Animated, {FadeOut, SlideInRight} from 'react-native-reanimated';
import Search from '../components/Search';
const Home = ({toast}) => {
  const currentDate = dayjs().format('dddd, DD MMMM YYYY');
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState('');
  const [weather, setWeather] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        // GET WEATHER DATA FROM OPENWEATHERMAP.ORG
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${OPENWEATHER_KEY}&units=metric`,
          )
          .then(res => {
            setWeather(res.data);
            setLoading(false);
          })
          .catch(err => {
            console.log(err.response.data);
          });
        // REVERSE GEOCODING FROM HERE MAP
        axios
          .get(
            `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${position.coords.latitude},${position.coords.longitude}&lang=en-US&apiKey=${HEREMAP_KEY}`,
          )
          .then(res => {
            setDistrict(res.data.items[0].address.district);
          })
          .catch(err => {
            console.log(err.response.data);
          });
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Geolocation.getCurrentPosition(
      position => {
        // GET WEATHER DATA FROM OPENWEATHERMAP.ORG
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${OPENWEATHER_KEY}&units=metric`,
          )
          .then(res => {
            setSearchCity('');
            setWeather(res.data);
            setRefreshing(false);
          })
          .catch(err => {
            console.log(err.response.data);
          });
        // REVERSE GEOCODING FROM HERE MAP
        axios
          .get(
            `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${position.coords.latitude},${position.coords.longitude}&lang=en-US&apiKey=${HEREMAP_KEY}`,
          )
          .then(res => {
            setDistrict(res.data.items[0].address.district);
          })
          .catch(err => {
            console.log(err.response.data);
          });
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  const renderItem = ({item, index}) => {
    return <Card item={item} key={index} index={index} />;
  };
  const searchHandle = () => {
    if (searchCity === '') {
      toast.current.show({
        type: 'warning',
        text: 'Please enter the city name',
        duration: 2000,
      });
    } else {
      // GET LAT AND LON FROM CITY NAME
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${OPENWEATHER_KEY}&units=metric`,
        )
        .then(res => {
          // GET WEATHER FROM LAT AND LON
          axios
            .get(
              `https://api.openweathermap.org/data/2.5/onecall?lat=${res.data.coord.lat}&lon=${res.data.coord.lon}&appid=${OPENWEATHER_KEY}&units=metric`,
            )
            .then(response => {
              setDistrict(res.data.name);
              setSearchCity('');
              setWeather(response.data);
            })
            .catch(err => {
              console.log(err.response.data);
            });
        })
        .catch(err => {
          if (err.response.status === 404) {
            toast.current.show({
              type: 'error',
              text: 'City not found',
              duration: 2000,
            });
          }
        });
    }
  };
  return (
    <SafeAreaView style={loading ? styles.containerLoader : styles.container}>
      {loading ? (
        <Animated.View style={styles.loader} exiting={FadeOut.duration(500)}>
          <ActivityIndicator size={'large'} color={'#C4E2FE'} />
        </Animated.View>
      ) : (
        <Animated.ScrollView
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{flex: 1}}
          entering={SlideInRight.duration(500).delay(500)}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#C4E2FE']}
              tintColor={'#C4E2FE'}
            />
          }
          showsVerticalScrollIndicator={false}>
          <View style={styles.topContainer}>
            <Search
              searchHandle={searchHandle}
              setCity={setSearchCity}
              city={searchCity}
            />
            <View>
              <Text style={styles.textDate}>{currentDate}</Text>
              <Text style={styles.textCity}>{district}</Text>
            </View>
            <Image
              source={getImage[weather.current.weather[0].icon]}
              style={[styles.image, {width: width * 0.7, height: width * 0.7}]}
            />
            <Text style={styles.textWeather}>
              {weather.current.weather[0].description}
            </Text>
            <View style={[styles.infoContainer, {width: width * 0.9}]}>
              <View style={styles.center}>
                <Text style={styles.infoTitle}>Wind</Text>
                <Text style={styles.infoText}>
                  {weather.current.wind_speed}
                </Text>
              </View>
              <View style={styles.center}>
                <Text style={styles.infoTitle}>Temp</Text>
                <Text style={styles.infoText}>
                  {weather.current.temp}&deg;C
                </Text>
              </View>
              <View style={styles.center}>
                <Text style={styles.infoTitle}>Humid</Text>
                <Text style={styles.infoText}>{weather.current.humidity}%</Text>
              </View>
            </View>
          </View>
          <View style={[styles.bottomContainer, {width: width}]}>
            <View style={styles.wrapper}>
              <Text style={styles.text}>Today</Text>
              <Pressable
                style={styles.nextButton}
                onPress={() => {
                  navigation.navigate('NextDay', {
                    dailyWeather: weather.daily,
                  });
                }}>
                <Text style={styles.text}>Next 7 Days</Text>
                <Image
                  source={require('../assets/icons/ArrowIcon.png')}
                  style={styles.arrowIcon}
                />
              </Pressable>
            </View>
            <FlatList
              data={weather.hourly}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </Animated.ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  containerLoader: {
    backgroundColor: '#C4E2FE',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#C4E2FE',
    flex: 1,
    justifyContent: 'space-between',
  },
  loader: {
    backgroundColor: 'white',
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    flex: 3 / 4,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'center',
    maxWidth: 300,
    maxHeight: 300,
  },
  textDate: {
    color: '#505A7D',
    fontSize: 16,
    textAlign: 'center',
  },
  textCity: {
    color: '#505A7D',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textWeather: {
    color: '#505A7D',
    fontSize: 34,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: 20,
    backgroundColor: 'white',
    paddingVertical: 20,
  },
  center: {justifyContent: 'center', alignItems: 'center'},
  infoTitle: {color: '#505A7D', marginBottom: 5},
  infoText: {color: '#505A7D', fontSize: 24, fontWeight: 'bold'},
  bottomContainer: {
    flex: 1 / 4,
    backgroundColor: 'white',
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    marginTop: 20,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  nextButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {color: '#505A7D', fontSize: 18},
  arrowIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    marginLeft: 8,
  },
});
