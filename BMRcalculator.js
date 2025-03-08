import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import Sidebar from './Sidebar';

const BMRCalculator = ({ navigation }) => {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [bmr, setBmr] = useState(null);

  const calculateBMR = () => {
    const parsedAge = parseInt(age);
    const parsedHeight = parseInt(height);
    const parsedWeight = parseInt(weight);

    if (
      isNaN(parsedAge) ||
      isNaN(parsedHeight) ||
      isNaN(parsedWeight) ||
      parsedAge <= 0 ||
      parsedHeight <= 0 ||
      parsedWeight <= 0
    ) {
      Alert.alert('Invalid Input', 'Please enter valid values.');
      return;
    }

    let bmrValue =
      gender === 'male'
        ? 10 * parsedWeight + 6.25 * parsedHeight - 5 * parsedAge + 5
        : 10 * parsedWeight + 6.25 * parsedHeight - 5 * parsedAge - 161;

    const activityFactors = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      super_active: 1.9,
    };

    const adjustedBMR = bmrValue * activityFactors[activityLevel];
    setBmr(adjustedBMR.toFixed(2));
    Alert.alert(
      'BMR Calculated',
      `Your BMR is ${adjustedBMR.toFixed(2)} kcal/day.`
    );
  };

  const useUserDetails = async () => {
    try {
      const userGender = await AsyncStorage.getItem('gender');
      const userAge = await AsyncStorage.getItem('age');
      const userHeight = await AsyncStorage.getItem('height');
      const userWeight = await AsyncStorage.getItem('weight');

      if (userGender && userAge && userHeight && userWeight) {
        setGender(userGender);
        setAge(userAge);
        setHeight(userHeight);
        setWeight(userWeight);
        Alert.alert(
          'User Details Loaded',
          'User details have been successfully loaded from AsyncStorage.'
        );
      } else {
        Alert.alert('Error', 'User details not found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Failed to load user details from AsyncStorage', error);
      Alert.alert('Error', 'Failed to load user details.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>BMR Calculator</Text>

        {/* Gender Selection */}
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === 'male' && styles.selectedGender,
            ]}
            onPress={() => setGender('male')}>
            <View style={styles.genderContent}>
              <FontAwesome5
                name="mars"
                size={20}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.genderText}>Male</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === 'female' && styles.selectedGender,
            ]}
            onPress={() => setGender('female')}>
            <View style={styles.genderContent}>
              <FontAwesome5
                name="venus"
                size={20}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.genderText}>Female</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <TextInput
          style={[styles.input, { borderColor: '#51c8a8', borderWidth: 2 }]}
          placeholder="Age"
          placeholderTextColor="#c4f3e6"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <TextInput
          style={[styles.input, { borderColor: '#51c8a8', borderWidth: 2 }]}
          placeholder="Height (cm)"
          placeholderTextColor="#c4f3e6"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />
        <TextInput
          style={[styles.input, { borderColor: '#51c8a8', borderWidth: 2 }]}
          placeholder="Weight (kg)"
          placeholderTextColor="#c4f3e6"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <TouchableOpacity style={styles.button} onPress={calculateBMR}>
          <Text style={styles.buttonText}>Calculate BMR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={useUserDetails}>
          <FontAwesome5
            name="user"
            size={20}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Use User Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('3 Course Meal Planner');
          }}
          style={styles.buttonContainer}>
          <FontAwesome5
            name="utensils"
            size={20}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Plan a Meal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Weight Progress Checker');
          }}
          style={styles.buttonContainer}>
          <FontAwesome5
            name="weight"
            size={20}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Record Weight</Text>
        </TouchableOpacity>

        {bmr && <Text style={styles.result}>Your BMR is: {bmr} kcal/day</Text>}
        <Sidebar navigation={navigation} />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e4d3d',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#c4f3e6',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#3a7859',
    color: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  genderButton: {
    flex: 1,  // Makes both buttons equal in width
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 8,
  },
  selectedGender: {
    backgroundColor: '#51c8a8',
  },
  genderContent: {
    flexDirection: 'row', // Aligns icon & text horizontally
    alignItems: 'center',
    gap: 8,  // Adds spacing between icon and text
  },
   genderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3a7859',
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#51c8a8',
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  result: {
    fontSize: 22,
    color: '#c4f3e6',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BMRCalculator;
