import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Communications from 'react-native-communications';

const AdminSendEmail = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState({
    healthTips: false,
    generalTips: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const storedUsers = await AsyncStorage.getItem('registeredUsers');
      const usersList = storedUsers ? JSON.parse(storedUsers) : [];
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  const toggleUserSelection = (email) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(email)
        ? prevSelected.filter((user) => user !== email)
        : [...prevSelected, email]
    );
  };

  const prepareMessage = () => {
    let finalMessage = message;
    if (checklist.healthTips) {
      finalMessage += '\n\nHealth Tips: Drink water, Exercise daily!';
    }
    if (checklist.generalTips) {
      finalMessage += '\n\nGeneral Tips: Stay organized, Plan your tasks!';
    }
    return finalMessage;
  };

  const handleSendEmail = () => {
    if (selectedUsers.length === 0 || !subject || !message) {
      Alert.alert(
        'Validation Error',
        'Please select users and fill out all fields.'
      );
      return;
    }

    const finalMessage = prepareMessage();

    // Open the default email app with pre-filled details
    Communications.email(
      selectedUsers, // List of recipient emails
      null, // CC (Carbon Copy)
      null, // BCC (Blind Carbon Copy)
      subject, // Subject of the email
      finalMessage // Body of the email
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin: Send Email to Users</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Subject"
        value={subject}
        onChangeText={setSubject}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Message"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <View style={styles.checklist}>
        <Text style={styles.checklistTitle}>Add Checklist Options:</Text>
        <View style={styles.checklistItem}>
          <Checkbox
            value={checklist.healthTips}
            onValueChange={() =>
              setChecklist((prev) => ({
                ...prev,
                healthTips: !prev.healthTips,
              }))
            }
          />
          <Text style={styles.checklistText}>Health Tips</Text>
        </View>
        <View style={styles.checklistItem}>
          <Checkbox
            value={checklist.generalTips}
            onValueChange={() =>
              setChecklist((prev) => ({
                ...prev,
                generalTips: !prev.generalTips,
              }))
            }
          />
          <Text style={styles.checklistText}>General Tips</Text>
        </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Checkbox
              value={selectedUsers.includes(item.email)}
              onValueChange={() => toggleUserSelection(item.email)}
            />
            <Text style={styles.userText}>{item.email}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSendEmail}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Email</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f9',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  checklist: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  checklistTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
    color: '#444',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checklistText: {
    marginLeft: 10,
    fontSize: 15,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  userText: {
    marginLeft: 10,
    color: '#555',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminSendEmail;
