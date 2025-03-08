import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Index = ({ navigation }) => {


  const login = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/logo_transparent.png')} />
      <Text style={styles.existingUserText}>Welcome to GoodFood</Text>
      <TouchableOpacity style={styles.signinBtn} onPress={login}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f9f9f9', // Light background color for a friendly feel
  },
  signinBtn: {
    alignItems: 'center',
    backgroundColor: '#4a90e2', // Softer blue for sign-in button
    paddingVertical: 12,
    width: 250,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  existingUserText: {
    color: '#415c0a',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '600', // Slightly bolder to differentiate it
  },
  logo: {
    height: 180,
    width: 280,
    marginBottom: 30,
    resizeMode: 'contain', // Ensures logo maintains aspect ratio
  },
});

export default Index;
