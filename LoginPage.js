import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const LoginPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserLogin = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        navigation.navigate('Main');
      }
    };
    checkUserLogin();
  }, [navigation]);

  const handleAuthentication = async () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Validation Error', 'Please fill up both fields.');
      return;
    }

    try {
      if (isLogin) {
        const storedUsers = await AsyncStorage.getItem('userRecords');
        const users = storedUsers ? JSON.parse(storedUsers) : [];

        const existingUser = users.find((user) => user.username === username);

        if (!existingUser) {
          Alert.alert(
            'Login Error',
            'User does not exist. Please sign up first.'
          );
          return;
        }

        if (existingUser.password !== password) {
          Alert.alert('Login Error', 'Incorrect password.');
          return;
        }

        await AsyncStorage.setItem('user', JSON.stringify(existingUser));
        setUser(existingUser);
        Alert.alert('Login Success', 'Welcome back!');
        navigation.navigate('Main');
      } else {
        const storedUsers = await AsyncStorage.getItem('userRecords');
        const users = storedUsers ? JSON.parse(storedUsers) : [];

        const existingUser = users.find((user) => user.username === username);

        if (existingUser) {
          Alert.alert('Signup Error', 'User already exists.');
          return;
        }

        const newUser = { username, password };
        users.push(newUser);
        await AsyncStorage.setItem('userRecords', JSON.stringify(users));

        Alert.alert('Signup Success', 'User created successfully!');
        navigation.navigate('User Information');
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  const handleAdminLogin = () => {
    if (username === 'Admin' && password === 'admin') {
      navigation.navigate('Admin');
    } else {
      Alert.alert('Admin Login Error', 'Invalid admin credentials.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {isLogin ? 'Welcome Back!' : 'Join Us!'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#1e4d3d"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#1e4d3d"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <View style={{ flexDirection: 'row', gap: 5 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleAuthentication}>
            <Text style={styles.buttonText}>
              {isLogin ? 'Login' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAdminLogin}
            style={styles.adminButton}>
            <Icon name="person-circle-outline" size={30} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.toggleButtonText}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e4d3d',
    padding: 20,
  },
  content: {
    width: '90%',
    backgroundColor: '#3a7859',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c4f3e6',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#51c8a8',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 8,
    color: '#fff',
  },
  button: {
    backgroundColor: '#006400',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  adminButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  toggleButtonText: {
    color: '#8de2d1',
    fontSize: 16,
    marginTop: 15,
  },
});

export default LoginPage;
