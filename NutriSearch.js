import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert, // Importing Alert
} from 'react-native';
import { foodData } from './Data'; // Import the data
import Sidebar from './Sidebar';

const NutriSearch = ({ navigation }) => {
  const [searchTextCalories, setSearchTextCalories] = useState('');
  const [searchTextFats, setSearchTextFats] = useState('');
  const [searchTextProtein, setSearchTextProtein] = useState('');
  const [searchTextCarbohydrates, setSearchTextCarbohydrates] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = () => {
    // Check if at least one search field is filled
    if (
      !searchTextCalories &&
      !searchTextFats &&
      !searchTextProtein &&
      !searchTextCarbohydrates
    ) {
      Alert.alert('Error', 'Please enter at least one search criteria.');
      return;
    }

    const filtered = foodData.filter((item) => {
      const caloriesMatch =
        Math.abs(item.nutrients.calories - parseInt(searchTextCalories)) <= 5;
      const fatsMatch =
        Math.abs(item.nutrients.fats - parseInt(searchTextFats)) <= 0.5;
      const proteinMatch =
        Math.abs(item.nutrients.protein - parseInt(searchTextProtein)) <= 1;
      const carbohydratesMatch =
        Math.abs(
          item.nutrients.carbohydrates - parseInt(searchTextCarbohydrates)
        ) <= 5;

      // Check if all criteria match
      return caloriesMatch && fatsMatch && proteinMatch && carbohydratesMatch;
    });

    // If no items matched the search criteria
    if (filtered.length === 0) {
      Alert.alert('No Results', 'No food items match your search criteria.');
    }

    setFilteredData(filtered);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Nutrition Search</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputColumn}>
          <Text style={styles.title}>Calories</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Calories"
            placeholderTextColor="#B0C4A1" // Lighter green placeholder text color
            onChangeText={setSearchTextCalories}
            keyboardType="numeric"
          />
          <Text style={styles.title}>Fats</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Fats"
            placeholderTextColor="#B0C4A1" // Lighter green placeholder text color
            onChangeText={setSearchTextFats}
            keyboardType="numeric"
          />
          <Text style={styles.title}>Protein</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Protein"
            placeholderTextColor="#B0C4A1" // Lighter green placeholder text color
            onChangeText={setSearchTextProtein}
            keyboardType="numeric"
          />
          <Text style={styles.title}>Carbohydrates</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Carbohydrates"
            placeholderTextColor="#B0C4A1" // Lighter green placeholder text color
            onChangeText={setSearchTextCarbohydrates}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <Text style={styles.buttonText}>Find</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.resultColumn}>
          <FlatList
            data={filteredData}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.nutrientText}>
                  Calories: {item.nutrients.calories}
                </Text>
                <Text style={styles.nutrientText}>
                  Fats: {item.nutrients.fats}
                </Text>
                <Text style={styles.nutrientText}>
                  Protein: {item.nutrients.protein}
                </Text>
                <Text style={styles.nutrientText}>
                  Carbohydrates: {item.nutrients.carbohydrates}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatList}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Food Substitute');
        }}
        style={styles.buttonContainer} // Style for the TouchableOpacity
      >
        <Text style={styles.buttonText}>Food Substitute</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Allergy Checker');
        }}
        style={styles.buttonContainer} // Style for the TouchableOpacity
      >
        <Text style={styles.buttonText}>Check Allergens</Text>
      </TouchableOpacity>
      <Sidebar navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#eef7ed', // Light green background
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3e6732', // Dark green text color
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#006400',
  },
  inputColumn: {
    flex: 1,
    marginRight: 10,
  },
  resultColumn: {
    flex: 1,
  },
  input: {
    height: 45,
    borderColor: '#91d18b', // Light green border color
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: '#3e6732', // Dark green text color
    borderRadius: 5,
    backgroundColor: '#ffffff', // White background for inputs
  },
  button: {
    backgroundColor: '#3e6732', // Dark green button background color
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#3e6732', // Green background color for the button
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    top: 10,
    borderRadius: 8, // Rounded corners
    alignItems: 'center', // Center the text
    justifyContent: 'center', // Center the text vertically
    elevation: 5, // Add a shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.3, // Shadow opacity for iOS
    shadowRadius: 4, // Shadow radius for iOS
    marginBottom: 5,
  },
  buttonText: {
    color: '#ffffff', // White text color
    fontWeight: 'bold',
  },
  itemContainer: {
    padding: 15,
    backgroundColor: '#ffffff', // White background
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // For Android shadow
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#3e6732', // Dark green text color
  },
  nutrientText: {
    color: '#3e6732', // Dark green text color
    marginVertical: 2,
  },
  flatList: {
    marginBottom: 20,
  },
});

export default NutriSearch;
