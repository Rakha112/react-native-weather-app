import {
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
  Image,
} from 'react-native';
import React from 'react';

const Search = ({searchHandle, setCity, city}) => {
  const {width} = useWindowDimensions();

  return (
    <View style={[styles.container, {width: width * 0.9}]}>
      <Image
        source={require('../assets/icons/SearchIcon.png')}
        style={styles.searchIcon}
      />
      <TextInput
        placeholder="Search..."
        placeholderTextColor={'#505A7D'}
        style={styles.input}
        defaultValue={city}
        onChangeText={e => setCity(e)}
        onSubmitEditing={() => {
          searchHandle(city);
        }}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    maxWidth: 500,
  },
  input: {
    padding: 12,
    marginLeft: 30,
    color: '#505A7D',
  },
  searchIcon: {
    position: 'absolute',
    width: 20,
    height: 20,
    marginLeft: 10,
  },
});
