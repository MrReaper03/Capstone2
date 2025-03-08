import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from './SearchBar';
import Sidebar from './Sidebar';

const Flatlist = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [grams, setGrams] = useState(100);
  const [foodData, setFoodData] = useState([]);

  const loadFoodData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('@food_data');
      const parsedData = storedData ? JSON.parse(storedData) : [];
      setFoodData(parsedData);
    } catch (error) {
      console.error('Failed to load food data:', error);
    }
  };

  useEffect(() => {
    loadFoodData();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleGramsChange = (text) => {
    setGrams(parseInt(text) || 0);
  };

  const filteredData = foodData.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const calculateNutrientsPerGram = (item, nutrient) => {
    return ((item.nutrients[nutrient] || 0) / 100) * grams;
  };

  return (
    <View style={styles.container}>
      <SearchBar onChangeText={handleSearch} />
      <Text style={styles.title}>Nutrient Calculator</Text>
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.nutrientText}>Calories: {calculateNutrientsPerGram(item, 'calories').toFixed(2)} kcal</Text>
              <Text style={styles.nutrientText}>Fats: {calculateNutrientsPerGram(item, 'fats').toFixed(2)} g</Text>
              <Text style={styles.nutrientText}>Protein: {calculateNutrientsPerGram(item, 'protein').toFixed(2)} g</Text>
              <Text style={styles.nutrientText}>Carbohydrates: {calculateNutrientsPerGram(item, 'carbohydrates').toFixed(2)} g</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        style={styles.flatList}
      />
      <Text style={styles.gramsLabel}>Enter Grams:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter grams"
        placeholderTextColor="#8de2d1"
        onChangeText={handleGramsChange}
        keyboardType="numeric"
        value={grams.toString()}
      />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Nutrient Picker');
        }}
        style={styles.buttonContainer}
      >
        <Text style={styles.buttonText}>Pick Nutrients</Text>
      </TouchableOpacity>
      <Sidebar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e4d3d',
    padding: 20,
  },
  title: {
    color: '#c4f3e6',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    letterSpacing: 1.2,
  },
  flatList: {
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#3a7859',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: 90,
    height: 90,
    marginRight: 15,
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#51c8a8',
    marginBottom: 5,
  },
  nutrientText: {
    fontSize: 16,
    color: '#c4f3e6',
  },
  gramsLabel: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8de2d1',
  },
  input: {
    height: 50,
    borderColor: '#51c8a8',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    color: '#1e4d3d',
    fontSize: 17,
  },
  buttonContainer: {
    backgroundColor: '#51c8a8',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default Flatlist;
