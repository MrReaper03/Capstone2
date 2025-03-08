import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProgressMonitoring = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem('userRecords');
        const usersList = storedUsers ? JSON.parse(storedUsers) : [];

        // Ensure BMI is set in user records
        const updatedUsers = usersList.map((user) => ({
          ...user,
          bmi: user.bmi || 'N/A', // Default to 'N/A' if missing
        }));

        setUsers(updatedUsers);
      } catch (error) {
        console.error('Error fetching users from AsyncStorage:', error);
        Alert.alert('Error', 'Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const loadUserData = (user) => {
    // Fixed function name
    setSelectedUser(user);
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User List</Text>
      {users.length === 0 ? (
        <Text style={styles.noUsersText}>No Users Available</Text>
      ) : (
        users.map((user, index) => (
          <TouchableOpacity
            key={index}
            style={styles.userCard}
            onPress={() => loadUserData(user)} // Updated function call
          >
            <Text style={styles.userText}>
              {user.username || 'Unnamed User'}
            </Text>
          </TouchableOpacity>
        ))
      )}

      {/* Modal for User Progress Details */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>User Progress</Text>
            {selectedUser && (
              <>
                <View style={styles.card}>
                  <FontAwesome5 name="weight" size={24} color="#1e3a76" />
                  <Text style={styles.subtitle}>
                    BMI: {selectedUser.bmi || 'N/A'}
                  </Text>
                </View>
                <View style={styles.card}>
                  <MaterialCommunityIcons
                    name="fire"
                    size={24}
                    color="#3c6cbe"
                  />
                  <Text style={styles.subtitle}>
                    BMR: {selectedUser.bmr !== null ? selectedUser.bmr : 'N/A'}{' '}
                    kcal
                  </Text>
                </View>
                <View style={styles.card}>
                  <FontAwesome5 name="chart-line" size={24} color="#5c8fff" />
                  <Text style={styles.subtitle}>Weight Changes:</Text>
                  {selectedUser.weightChanges &&
                  selectedUser.weightChanges.length > 0 ? (
                    selectedUser.weightChanges.map((entry, index) => (
                      <Text key={index} style={styles.text}>
                        {entry.date}: {entry.weight} kg
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.text}>No weight data available.</Text>
                  )}
                </View>
                <View style={styles.card}>
                  <MaterialCommunityIcons
                    name="food"
                    size={24}
                    color="#94c4ff"
                  />
                  <Text style={styles.subtitle}>Meal Plans:</Text>
                  {selectedUser.mealPlans &&
                  selectedUser.mealPlans.length > 0 ? (
                    selectedUser.mealPlans.map((meal, index) => (
                      <Text key={index} style={styles.text}>
                        {meal.date}: {meal.breakfast}, {meal.lunch},{' '}
                        {meal.dinner}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.text}>No meal plans recorded.</Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#d1e9ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a76',
    marginBottom: 16,
    textAlign: 'center',
  },
  noUsersText: {
    fontSize: 18,
    color: '#1e3a76',
    textAlign: 'center',
    marginTop: 20,
  },
  userCard: {
    backgroundColor: '#5c8fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  userText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#d1e9ff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  card: {
    backgroundColor: '#94c4ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a76',
    marginTop: 8,
  },
  text: {
    fontSize: 16,
    color: '#3c6cbe',
  },
  closeButton: {
    backgroundColor: '#1e3a76',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UserProgressMonitoring;