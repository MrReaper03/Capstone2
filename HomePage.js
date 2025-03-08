import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you're using Ionicons for icons
import AsyncStorage from '@react-native-async-storage/async-storage'; // For local storage
import Sidebar from './Sidebar';
import { useFocusEffect } from '@react-navigation/native';

const HomePage = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [userInfo, setUserInfo] = useState({
    name: '',
    gender: '',
    age: '',
    birthday: '',
    height: '',
    weight: '',
  });

  const loadUserInfo = async () => {
    try {
      console.log('Loading user info...');
      const name = await AsyncStorage.getItem('name');
      const gender = await AsyncStorage.getItem('gender');
      const age = await AsyncStorage.getItem('age');
      const birthday = await AsyncStorage.getItem('birthday');
      const height = await AsyncStorage.getItem('height');
      const weight = await AsyncStorage.getItem('weight');

      console.log('Retrieved values:', {
        name,
        gender,
        age,
        birthday,
        height,
        weight,
      });

      setUserInfo({
        name: name || '',
        gender: gender || '',
        age: age || '',
        birthday: birthday || '',
        height: height || '',
        weight: weight || '',
      });
    } catch (error) {
      console.error('Failed to load user info', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('HomePage is focused. Loading user info...');
      loadUserInfo();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user'); // Clear the logged-in user
      Alert.alert('Success', 'User logged out successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      console.error('Logout error:', error.message);
      Alert.alert('Logout Error', 'Failed to log out.');
    }
  };

  const handleProfilePressed = () => {
    setModalVisible(true); // Show modal when profile is pressed
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome, {userInfo.name}!</Text>

      {/* Profile Button */}
      <TouchableOpacity
        onPress={handleProfilePressed}
        style={styles.iconButton}>
        <Icon name="person-circle-outline" size={50} color="#1B5E20" />
      </TouchableOpacity>

      {/* User Info Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>User Information</Text>
            <Text style={styles.userInfoText}>Name: {userInfo.name}</Text>
            <Text style={styles.userInfoText}>Gender: {userInfo.gender}</Text>
            <Text style={styles.userInfoText}>Age: {userInfo.age}</Text>
            <Text style={styles.userInfoText}>
              Birthday: {new Date(userInfo.birthday).toLocaleDateString()}
            </Text>
            <Text style={styles.userInfoText}>
              Height: {userInfo.height} cm
            </Text>
            <Text style={styles.userInfoText}>
              Weight: {userInfo.weight} kg
            </Text>

            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
              style={styles.profBtn}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>

            <Button title="Logout" onPress={handleLogout} color="#B71C1C" />
          </View>
        </View>
      </Modal>
      <Sidebar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9', // Subtle green background
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20', // Dark green for text
    marginBottom: 30,
    fontFamily: 'Avenir', // Premium font (fallback handled by OS)
  },
  iconButton: {
    marginBottom: 30,
    padding: 10,
    backgroundColor: '#C8E6C9', // Soft green for button background
    borderRadius: 50,
    elevation: 5, // Subtle shadow
    zIndex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', // Darker dimmed background for a premium feel
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    borderWidth: 2,
    borderColor: '#4CAF50', // Premium green border
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1B5E20', // Deep green
  },
  userInfoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  profBtn: {
    backgroundColor: '#388E3C', // Darker green for button
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
    width: 100,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomePage;
