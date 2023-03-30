import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import React, {useEffect} from 'react';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Carousel from '../components/Carousel';
import dayjs from 'dayjs';
import getImage from '../utilities/getImage';
import {SafeAreaView} from 'react-native-safe-area-context';
const NextDay = ({route}) => {
  const {dailyWeather} = route.params;
  useEffect(() => {
    changeNavigationBarColor('#C4E2FE', true);
    return () => {
      changeNavigationBarColor('#FFFFFF', true);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Carousel data={dailyWeather} autoPlay={true} pagination={true} />
        {dailyWeather.slice(1).map((item, index) => {
          return (
            <View key={index} style={styles.listContainer}>
              <Text style={styles.textDay}>
                {dayjs(item.dt * 1000).format('dddd')}
              </Text>
              <View style={styles.weatherContainer}>
                <View style={styles.center}>
                  <Text style={styles.textTemp}>Min</Text>
                  <Text style={styles.textTemp}>{item.temp.min}&deg;C</Text>
                </View>
                <Image
                  source={getImage[item.weather[0].icon]}
                  style={styles.weatherIcon}
                />
                <View style={styles.center}>
                  <Text style={styles.textTemp}>Max</Text>
                  <Text style={styles.textTemp}>{item.temp.max}&deg;C</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NextDay;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#C4E2FE'},
  arrowIcon: {
    transform: [{rotate: '180deg'}],
  },
  listContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 20,
  },
  textDay: {
    color: '#505A7D',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#505A7D',
    paddingTop: 10,
  },
  center: {justifyContent: 'center', alignItems: 'center'},
  weatherIcon: {
    width: 50,
    height: 50,
    resizeMode: 'center',
  },
  textTemp: {
    color: '#505A7D',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
