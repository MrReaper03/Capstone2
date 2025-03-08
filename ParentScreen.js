import React from 'react';
import { View } from 'react-native';
import SearchBar from './SearchBar';
import { useNavigation } from '@react-navigation/native';

const ParentScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <SearchBar navigation={navigation} />
    </View>
  );
};

export default ParentScreen;
