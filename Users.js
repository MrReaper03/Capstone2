import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Sidebar } from './adminHome';

const Users = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem('userRecords');
        const usersList = storedUsers ? JSON.parse(storedUsers) : [];

        if (!Array.isArray(usersList)) {
          console.error('Invalid data format in AsyncStorage:', usersList);
          Alert.alert('Error', 'Corrupted user data detected.');
          return;
        }

        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users from AsyncStorage:', error);
        Alert.alert('Error', 'Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const handleRemoveUser = async (usernameToRemove) => {
    try {
      const updatedUsers = users.filter(user => user.username !== usernameToRemove);
      await AsyncStorage.setItem('userRecords', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      Alert.alert('User removed successfully');
    } catch (error) {
      console.error('Error removing user:', error);
      Alert.alert('Error', 'Failed to remove user');
    }
  };

  const maskPassword = (password = '') => '*'.repeat(password.length);

  const renderUser = ({ item }) => (
    <View style={styles.userContainer}>
      <Text style={styles.userText}><Text style={styles.label}>Name:</Text> {item.username}</Text>
      <Text style={styles.userText}><Text style={styles.label}>Email:</Text> {item.email}</Text>
      <Text style={styles.userText}>
        <Text style={styles.label}>Password:</Text> {item.password ? maskPassword(item.password) : 'N/A'}
      </Text>
      <TouchableOpacity
        style={styles.removeButtonContainer}
        onPress={() => handleRemoveUser(item.username)}
      >
        <Ionicons name="trash" size={18} color="#fff" />
        <Text style={styles.removeButtonText}> Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <View style={styles.container}>
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} navigation={navigation} />

      {/* Sidebar Open Button (Only Visible When Sidebar is Closed) */}
      {!isSidebarOpen && (
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Ionicons name="menu" size={30} color="#d1e9ff" />
        </TouchableOpacity>
      )}

      {/* Users List */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.username}
        renderItem={renderUser}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1e3a76',
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#1e3a76', // Dark blue background
    opacity: 0.5, // Half transparency
    padding: 10,
    borderRadius: 30, // Rounded corners
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Ensures button is on top
  },
  userContainer: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#3c6cbe',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#5c8fff',
  },
  userText: {
    fontSize: 16,
    color: '#d1e9ff',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#94c4ff',
  },
  removeButtonContainer: {
    marginTop: 10,
    backgroundColor: '#e63946',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default Users;
