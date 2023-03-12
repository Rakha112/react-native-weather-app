import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
const Button = ({text, pressHandler}) => {
  const {width} = useWindowDimensions();
  const [press, setPress] = useState(false);
  const navigation = useNavigation();
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: press
            ? withTiming(0.9, {duration: 200})
            : withTiming(1, {duration: 200}),
        },
      ],
    };
  });
  return (
    <TouchableWithoutFeedback
      onPressIn={() => {
        setPress(true);
      }}
      onPressOut={() => {
        setPress(false);
      }}
      onPress={() => {
        pressHandler();
      }}>
      <Animated.View
        style={[styles.button, {width: width * 0.75}, animatedButtonStyle]}>
        <Text style={styles.textButton}>{text}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {backgroundColor: '#C4E2FE', padding: 20, borderRadius: 19},
  textButton: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
