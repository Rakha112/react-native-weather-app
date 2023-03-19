import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import getImage from '../utilities/getImage';
import dayjs from 'dayjs';

const Card = ({item}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textDate}>
        {dayjs(item.dt * 1000).format('HH.mm') === '00.00'
          ? dayjs(item.dt * 1000).format('DD MMM')
          : dayjs(item.dt * 1000).format('HH.mm')}
      </Text>
      <Image source={getImage[item.weather[0].icon]} style={styles.image} />
      <Text style={styles.textTemp}>{item.temp}&deg;C</Text>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    width: 100,
    backgroundColor: '#C4E2FE',
    marginHorizontal: 10,
    borderRadius: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  textDate: {
    color: '#505A7D',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {width: 60, height: 60, resizeMode: 'center'},
  textTemp: {
    color: '#505A7D',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
