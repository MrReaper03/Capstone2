import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Form = ({ navigation }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [show, setShow] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  // Clear fields when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setName('');
      setGender('');
      setAge('');
      setBirthday(new Date());
      setHeight('');
      setWeight('');
    }, [])
  );

  const handleFormSubmit = async () => {
    // Validation checks for empty fields
    if (!name || !gender || !age || !height || !weight) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Check if age is a valid number
    if (isNaN(age) || age <= 0) {
      Alert.alert('Invalid Age', 'Please enter a valid age.');
      return;
    }

    // Check if height is a valid number
    if (isNaN(height) || height <= 0) {
      Alert.alert('Invalid Height', 'Please enter a valid height.');
      return;
    }

    // Check if weight is a valid number
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight.');
      return;
    }

    try {
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('gender', gender);
      await AsyncStorage.setItem('age', age);
      await AsyncStorage.setItem('birthday', birthday.toISOString());
      await AsyncStorage.setItem('height', height);
      await AsyncStorage.setItem('weight', weight);

      // Form submission logic here
      console.log({
        name,
        gender,
        age,
        birthday,
        height,
        weight,
      });

      Alert.alert('Success', 'Your information has been submitted successfully!');
      navigation.navigate('Main'); // Navigate to Main after successful submission
    } catch (error) {
      console.error('Failed to save form data', error);
      Alert.alert('Error', 'There was an error saving your data.');
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setShow(Platform.OS === 'ios');
    setBirthday(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#A0A0A0"
        />
        <View style={styles.radioContainer}>
          <Text style={styles.label}>Gender:</Text>
          <TouchableOpacity
            style={[styles.radioButton, gender === 'male' && styles.radioButtonSelected]}
            onPress={() => setGender('male')}
          >
            <Text style={[styles.radioText, gender === 'male' && styles.radioTextSelected]}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioButton, gender === 'female' && styles.radioButtonSelected]}
            onPress={() => setGender('female')}
          >
            <Text style={[styles.radioText, gender === 'female' && styles.radioTextSelected]}>Female</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholderTextColor="#A0A0A0"
        />
        <TouchableOpacity onPress={showDatepicker} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>Select Birthday</Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={birthday}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
        <Text style={styles.dateText}>
          Selected Date: {birthday.toDateString()}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          placeholderTextColor="#A0A0A0"
        />
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholderTextColor="#A0A0A0"
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleFormSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f1f8e9', // Soft green background
  },
  input: {
    width: '100%',
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#B2DFDB',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dateButton: {
    backgroundColor: '#388e3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  dateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  dateText: {
    marginTop: 8,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#388e3c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    marginRight: 10,
    fontWeight: 'bold',
    color: '#388e3c',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#388e3c',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 12,
  },
  radioButtonSelected: {
    backgroundColor: '#388e3c',
  },
  radioText: {
    color: '#388e3c',
  },
  radioTextSelected: {
    color: '#fff',
  },
});

export default Form;
