import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { starters, mainCourse, dessert } from './mealData';
import Sidebar from './Sidebar';

const CourseMeal = ({ navigation }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedData, setSelectedData] = useState([]);

  // Create a ref for ScrollView
  const scrollViewRef = useRef();
  // Create a ref for the selected item details
  const detailsRef = useRef();

  const handleCategorySelected = (category) => {
    setSelectedCategory(category);
    switch (category) {
      case 'Main Course':
        setSelectedData(mainCourse);
        break;
      case 'Dessert':
        setSelectedData(dessert);
        break;
      default:
        setSelectedData([]);
        break;
    }
    setSelectedItem(null); // Reset selected item if category changes
  };

  const handleItemSelected = (item) => {
    setSelectedItem(item);
    // Scroll to the details section when an item is selected
    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ScrollView style={styles.container} ref={scrollViewRef}>
      <View>
        <Text style={styles.title}>Categories:</Text>
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            onPress={() => handleCategorySelected('Main Course')}>
            <Text
              style={
                selectedCategory === 'Main Course'
                  ? styles.selectedCategory
                  : styles.category
              }>
              Main Course
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCategorySelected('Dessert')}>
            <Text
              style={
                selectedCategory === 'Dessert'
                  ? styles.selectedCategory
                  : styles.category
              }>
              Dessert
            </Text>
          </TouchableOpacity>
        </View>

        {/* Show the list only if no item is selected */}
        {!selectedItem && (
          <>
            <Text style={styles.title}>Selected Items:</Text>
            <FlatList
              data={selectedData}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleItemSelected(item)}>
                  <View style={styles.itemContainer}>
                    <Image source={item.image} style={styles.image} />
                    <Text>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </>
        )}

        {/* Show details if an item is selected */}
        {selectedItem && (
          <View style={styles.detailsContainer} ref={detailsRef}>
            <Text style={styles.detailsTitle}>{selectedItem.name}</Text>
            <Image source={selectedItem.image} style={styles.selectedImage} />
            <Text>Grams: {selectedItem.grams}</Text>
            <Text>Calories: {selectedItem.nutrients.calories}</Text>
            <Text>Fats: {selectedItem.nutrients.fats}</Text>
            <Text>Protein: {selectedItem.nutrients.protein}</Text>
            <Text>Carbohydrates: {selectedItem.nutrients.carbohydrates}</Text>
            <Text style={styles.nutrientTitle}>Other Nutrients:</Text>
            <Text>{selectedItem.other.vitamins.join(', ')}</Text>
            <Text>{selectedItem.other.minerals.join(', ')}</Text>
            <Text>{selectedItem.other.otherNutrients.join(', ')}</Text>
            <Text style={styles.ingredientsTitle}>Ingredients:</Text>
            {selectedItem.ingredients &&
              selectedItem.ingredients.length > 0 && (
                <FlatList
                  data={selectedItem.ingredients}
                  renderItem={({ item }) => (
                    <Text>{`${item.quantity} ${item.unit} ${item.name}`}</Text>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            {selectedItem.instructions &&
              selectedItem.instructions.length > 0 &&
              selectedItem.instructions.map((step, index) => (
                <Text key={index}>{`${index + 1}. ${step}`}</Text>
              ))}
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Todays Course'); // ✅ Matches the Stack.Screen name
          }}
          style={styles.buttonContainer} // Style for the TouchableOpacity
        >
          <Text style={styles.buttonText}>Course of the day</Text>
        </TouchableOpacity>
        <Sidebar navigation={navigation} style={styles.sidebar} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: 100,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#3e6732',
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  category: {
    fontSize: 16,
    backgroundColor: '#3e6732',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: 'center',
  },
  selectedCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#2c4d27',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 5,
  },
  detailsContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#91d18b',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3e6732',
  },
  selectedImage: {
    width: 180,
    height: 180,
    marginBottom: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  nutrientTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#3e6732',
  },
  ingredientsTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3e6732',
  },
  instructionsTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3e6732',
  },
  buttonContainer: {
    backgroundColor: '#3e6732', // Green background color for the button
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
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
    fontSize: 16, // Font size of the text
    fontWeight: 'bold', // Make the text bold
    color: '#fff', // White text color
    textAlign: 'center', // Center the text horizontally
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0, // Adjust if needed
    width: 250, // Adjust width based on your design
    height: '100%',
    zIndex: 1000, // Ensure it stays above other content
    backgroundColor: '#1e4d3d', // Ensure it has a background
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default CourseMeal;
