import {StyleSheet, View, Image, useWindowDimensions, Text} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  useAnimatedRef,
} from 'react-native-reanimated';
import Pagination from './Pagination';
import getImage from '../utilities/getImage';
import dayjs from 'dayjs';
const Carousel = ({data, autoPlay, pagination}) => {
  const scrollViewRef = useAnimatedRef(null);
  const interval = useRef();
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay);
  const [newData] = useState([
    {key: 'spacer-left'},
    ...data,
    {key: 'spacer-right'},
  ]);
  const {width} = useWindowDimensions();
  const SIZE = width * 0.8;
  const SPACER = (width - SIZE) / 2;
  const x = useSharedValue(0);
  const offSet = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  useEffect(() => {
    if (isAutoPlay === true) {
      let _offSet = offSet.value;
      interval.current = setInterval(() => {
        if (_offSet >= Math.floor(SIZE * (data.length - 1) - 10)) {
          _offSet = 0;
        } else {
          _offSet = Math.floor(_offSet + SIZE);
        }
        scrollViewRef.current.scrollTo({x: _offSet, y: 0});
      }, 4000);
    } else {
      clearInterval(interval.current);
    }
  }, [SIZE, SPACER, isAutoPlay, data.length, offSet.value, scrollViewRef]);

  return (
    <View>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        onScrollBeginDrag={() => {
          setIsAutoPlay(false);
        }}
        onMomentumScrollEnd={e => {
          offSet.value = e.nativeEvent.contentOffset.x;
          setIsAutoPlay(autoPlay);
        }}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SIZE}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}>
        {newData.map((item, index) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const style = useAnimatedStyle(() => {
            const scale = interpolate(
              x.value,
              [(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE],
              [0.88, 1, 0.88],
            );
            return {
              transform: [{scale}],
            };
          });
          if (!item.weather) {
            return <View style={{width: SPACER}} key={index} />;
          }
          return (
            <View style={{width: SIZE}} key={index}>
              <Animated.View style={[styles.container, style]}>
                <Text style={styles.text16}>
                  {dayjs(item.dt * 1000).format('dddd, DD MMMM YYYY')}
                </Text>
                <Image
                  source={getImage[item.weather[0].icon]}
                  style={styles.weatherIcon}
                />
                <Text style={styles.text18}>{item.weather[0].description}</Text>
                <View style={styles.tempContainer}>
                  <View style={styles.tempTextWrapper}>
                    <View style={styles.center}>
                      <Text style={styles.text16}>Morning</Text>
                      <Text style={styles.text18}>{item.temp.morn}&deg;C</Text>
                    </View>
                    <View style={styles.center}>
                      <Text style={styles.text16}>Day</Text>
                      <Text style={styles.text18}>{item.temp.day}&deg;C</Text>
                    </View>
                  </View>
                  <View style={styles.tempTextWrapper}>
                    <View style={styles.center}>
                      <Text style={styles.text16}>Evening</Text>
                      <Text style={styles.text18}>{item.temp.eve}&deg;C</Text>
                    </View>
                    <View style={styles.center}>
                      <Text style={styles.text16}>Night</Text>
                      <Text style={styles.text18}>{item.temp.night}&deg;C</Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>
      {pagination && <Pagination data={data} x={x} size={SIZE} />}
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'white',
    height: 450,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 100,
    height: 100,
    resizeMode: 'center',
  },
  tempTextWrapper: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempContainer: {
    width: '90%',
    height: 150,
    backgroundColor: '#C4E2FE',
    borderRadius: 9,
    justifyContent: 'space-around',
    // alignItems: 'center',
  },
  text16: {color: '#505A7D', fontSize: 16, fontWeight: 'bold'},
  text18: {color: '#505A7D', fontSize: 18, fontWeight: 'bold'},
});
