import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { starters, mainCourse, dessert } from './mealData';
import Sidebar from './Sidebar';

const AllergySearch = ({ navigation }) => {
  const [allergicFood, setAllergicFood] = useState('');
  const [filteredMeals, setFilteredMeals] = useState([]);

  const searchAllergicFood = () => {
    const allMeals = [...starters, ...mainCourse, ...dessert];
    const filteredMeals = allMeals.filter((meal) =>
      meal.ingredients.some((ingredient) =>
        ingredient.name.toLowerCase().includes(allergicFood.toLowerCase())
      )
    );
    setFilteredMeals(filteredMeals);
  };

  const renderItem = ({ item }) => (
    <View style={styles.mealContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.label}>Ingredients:</Text>
      {item.ingredients.map((ingredient, index) => (
        <Text key={index} style={styles.ingredient}>
          - {ingredient.name}
        </Text>
      ))}
      <Text style={styles.label}>Nutrients:</Text>
      <Text style={styles.nutrient}>Calories: {item.nutrients.calories}</Text>
      <Text style={styles.nutrient}>Protein: {item.nutrients.protein}</Text>
      <Text style={styles.nutrient}>Fats: {item.nutrients.fats}</Text>
      <Text style={styles.nutrient}>
        Carbohydrates: {item.nutrients.carbohydrates}
      </Text>
      <Text style={styles.nutrient}>Fiber: {item.nutrients.fiber}</Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <Text style={styles.title}>Allergy Search</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={20} color="#8de2d1" style={styles.icon} />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setAllergicFood(text)}
          value={allergicFood}
          placeholder="Enter allergic food"
          placeholderTextColor="#8de2d1"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={searchAllergicFood}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredMeals}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.list}
      />
      <Sidebar navigation={navigation} />
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1e4d3d',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c4f3e6',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a7859',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    color: '#c4f3e6',
  },
  button: {
    backgroundColor: '#51c8a8',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#1e4d3d',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mealContainer: {
    padding: 15,
    backgroundColor: '#3a7859',
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#c4f3e6',
    fontSize: 18,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 5,
    color: '#c4f3e6',
  },
  ingredient: {
    marginLeft: 10,
    color: '#8de2d1',
  },
  nutrient: {
    color: '#c4f3e6',
    marginTop: 2,
  },
  list: {
    paddingBottom: 20,
  },
});

export default AllergySearch;
