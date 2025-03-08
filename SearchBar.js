import React, { useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

const SearchBar = ({ onChangeText }) => {
  const [text, setText] = useState('');

  const handleChangeText = (newText) => {
    setText(newText);
    onChangeText(newText);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        placeholderTextColor="gray"
        value={text}
        onChangeText={handleChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10, // Rounded corners for a more modern look
    margin: 15, // Increased margin for better spacing
    elevation: 3, // Subtle shadow for depth on Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  input: {
    height: 50, // Increased height for better visibility
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 10, // Same radius for consistency
    paddingHorizontal: 15,
    fontSize: 16, // Larger text for readability
    color: '#333', // Darker text color for better contrast
  },
});

export default SearchBar;
