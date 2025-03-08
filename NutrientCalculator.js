import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { foodData } from './Data';
import Sidebar from './Sidebar';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

const NutrientCalculator = ({ navigation }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male'); // Default to male
  const [isVegetarian, setIsVegetarian] = useState(false); // Default to non-vegetarian
  const [bmi, setBMI] = useState(null);
  const [suggestion, setSuggestion] = useState('');
  const [suggestedFoods, setSuggestedFoods] = useState([]);

  const calculateBMI = async () => {
  if (!height || !weight || !age) {
    Alert.alert(
      'Invalid Input',
      'Please fill in all fields before calculating BMI'
    );
    return;
  }

  const heightInMeters = height / 100;
  const bmiValue = weight / (heightInMeters * heightInMeters);
  const bmiFixed = bmiValue.toFixed(2);

  setBMI(bmiFixed);
  generateSuggestion(bmiValue);

  try {
    // Retrieve existing records
    const storedData = await AsyncStorage.getItem('userRecords');
    let userRecords = storedData ? JSON.parse(storedData) : [];

    // Create a new entry
    const newRecord = {
      date: new Date().toISOString(),
      height,
      weight,
      age,
      bmi: bmiFixed,
    };

    // Update the records array
    userRecords.push(newRecord);

    // Save back to AsyncStorage
    await AsyncStorage.setItem('userRecords', JSON.stringify(userRecords));
    Alert.alert('Success', 'BMI saved successfully!');
  } catch (error) {
    console.error('Error saving BMI:', error);
    Alert.alert('Error', 'Failed to save BMI data');
  }
};

  const generateSuggestion = (bmiValue) => {
    if (bmiValue < 18.5) {
      setSuggestion(
        'You are underweight. Try to increase your calorie intake with foods rich in healthy fats and protein.'
      );
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      setSuggestion('You have a healthy BMI. Keep up the balanced diet!');
    } else {
      setSuggestion(
        'You are overweight or obese. Focus on a balanced diet with portion control and increase physical activity.'
      );
    }
  };

  const handleSuggestedFood = () => {
    let suggestedFoods = [];
    if (bmi < 18.5) {
      suggestedFoods = foodData.filter((food) => food.nutrients.calories > 100);
    } else if (bmi >= 25) {
      suggestedFoods = foodData.filter((food) => food.nutrients.calories < 100);
    }
    setSuggestedFoods(suggestedFoods);
  };

  const closeSuggestedFoods = () => {
    setSuggestedFoods([]);
  };

  const handleSuggestedDiet = () => {
    let suggestedFoods = foodData.filter(
      (food) => food.nutrients.calories < 200
    );
    setSuggestedFoods(suggestedFoods);
  };

  const handleWeightGain = () => {
    let suggestedFoods = foodData.filter(
      (food) => food.nutrients.calories > 200
    );
    setSuggestedFoods(suggestedFoods);
  };

  const handleGainMuscles = () => {
    let suggestedFoods = foodData.filter((food) => food.nutrients.protein > 20);
    setSuggestedFoods(suggestedFoods);
  };

  const handleLoseWeight = () => {
    let suggestedFoods = foodData.filter(
      (food) => food.nutrients.calories < 100
    );
    setSuggestedFoods(suggestedFoods);
  };

  // Function to use user details and populate form
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Nutrient Calculator</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                gender === 'male' && styles.radioButtonSelected,
              ]}
              onPress={() => setGender('male')}>
              <Icon
                name="mars"
                size={30}
                color={gender === 'male' ? '#fff' : '#333'}
              />
              <Text style={styles.radioButtonText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                gender === 'female' && styles.radioButtonSelected,
              ]}
              onPress={() => setGender('female')}>
              <Icon
                name="venus"
                size={30}
                color={gender === 'female' ? '#fff' : '#333'}
              />
              <Text style={styles.radioButtonText}>Female</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={calculateBMI}>
          <Text style={styles.buttonText}>Calculate BMI</Text>
        </TouchableOpacity>
        {bmi && <Text style={styles.result}>Your BMI: {bmi}</Text>}
        {suggestion !== '' && (
          <View style={styles.suggestionContainer}>
            <Text style={styles.suggestion}>{suggestion}</Text>
            {bmi < 18.5 && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSuggestedFood}>
                  <Text style={styles.buttonText}>Suggested Food</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleWeightGain}>
                  <Text style={styles.buttonText}>Gain Weight</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleGainMuscles}>
                  <Text style={styles.buttonText}>Gain Muscles</Text>
                </TouchableOpacity>
              </View>
            )}
            {bmi >= 25 && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSuggestedDiet}>
                  <Text style={styles.buttonText}>Suggested Diet</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleLoseWeight}>
                  <Text style={styles.buttonText}>Lose Weight</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {/* Rendering suggested foods */}
        {suggestedFoods.length > 0 && (
          <View>
            <Text style={styles.foodTitle}>Suggested Foods</Text>
            {suggestedFoods.map((food) => (
              <View key={food.id} style={styles.foodItem}>
                <Image source={{ uri: food.image }} style={styles.foodImage} />
                <Text style={styles.foodName}>{food.name}</Text>
                <Text>Calories: {food.nutrients.calories}</Text>
                <Text>Fats: {food.nutrients.fats}</Text>
                <Text>Protein: {food.nutrients.protein}</Text>
                <Text>Carbohydrates: {food.nutrients.carbohydrates}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.button}
              onPress={closeSuggestedFoods}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={useUserDetails}>
        <FontAwesome5 name="user" size={20} color="#fff" style={styles.icon} />
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
      <Sidebar navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e4d3d', // Deep royal green
    padding: 20,
  },
  content: {
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#c4f3e6', // Light mint
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Helvetica Neue',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  label: {
    fontSize: 18,
    color: '#8de2d1', // Soft pastel mint
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#51c8a8', // Vibrant green border
    borderWidth: 2,
    borderRadius: 14,
    paddingLeft: 15,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 14,
    backgroundColor: '#3a7859', // Refined green
    width: 130,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  radioButtonSelected: {
    backgroundColor: '#51c8a8', // Brighter green for selection
  },
  radioButtonText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
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
  result: {
    fontSize: 22,
    color: '#c4f3e6',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  suggestionContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#264b3c',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  suggestion: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  foodTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c4f3e6',
    marginVertical: 20,
    textAlign: 'center',
  },
  foodItem: {
    backgroundColor: '#3a7859',
    borderRadius: 14,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 14,
    marginBottom: 10,
  },
  foodName: {
    fontSize: 20,
    color: '#c4f3e6',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icon: {
    marginRight: 10,
  },
});

export default NutrientCalculator;
