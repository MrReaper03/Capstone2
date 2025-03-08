import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Keyboard,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Sidebar } from './adminHome';

const FoodDatabase = ({ navigation }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [foodData, setFoodData] = useState([]);
  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    fats: '',
    protein: '',
    carbohydrates: '',
    image: '',
  });

  const scrollViewRef = useRef(null);

  const loadFoodData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@food_data');
      if (jsonValue != null) {
        setFoodData(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load food data:', e);
    }
  };

  const addFood = async () => {
    if (
      !newFood.name ||
      !newFood.calories ||
      !newFood.fats ||
      !newFood.protein ||
      !newFood.carbohydrates
    ) {
      alert('Please fill in all fields');
      return;
    }

    const newFoodItem = {
      id: foodData.length + 1,
      name: newFood.name,
      image: newFood.image || '',
      nutrients: {
        calories: parseFloat(newFood.calories),
        fats: parseFloat(newFood.fats),
        protein: parseFloat(newFood.protein),
        carbohydrates: parseFloat(newFood.carbohydrates),
      },
    };

    const updatedFoodData = [...foodData, newFoodItem];

    try {
      await AsyncStorage.setItem('@food_data', JSON.stringify(updatedFoodData));
      setFoodData(updatedFoodData);
      setNewFood({
        name: '',
        calories: '',
        fats: '',
        protein: '',
        carbohydrates: '',
        image: '',
      });
    } catch (e) {
      console.error('Failed to save new food:', e);
    }
  };

  const scrollToForm = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    loadFoodData();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Sidebar
              isOpen={isSidebarOpen}
              toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
              navigation={navigation}
            />
            {!isSidebarOpen && (
              <TouchableOpacity
                onPress={() => setSidebarOpen(true)}
                style={styles.menuButton}>
                <Ionicons name="menu" size={30} color="#d1e9ff" />
              </TouchableOpacity>
            )}

            <Text style={styles.title}>Food Database</Text>

            <TouchableOpacity style={styles.addButton} onPress={scrollToForm}>
              <Ionicons name="add-circle-outline" size={24} color="#ffffff" />
              <Text style={styles.addButtonText}>Add New Food</Text>
            </TouchableOpacity>

            <View style={styles.foodListContainer}>
              <FlatList
                data={foodData}
                renderItem={({ item }) => (
                  <View style={styles.itemContainer}>
                    <Image source={item.image} style={styles.image} />
                    <View style={styles.textContainer}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.nutrientText}>
                        Calories: {item.nutrients.calories} kcal
                      </Text>
                      <Text style={styles.nutrientText}>
                        Fats: {item.nutrients.fats} g
                      </Text>
                      <Text style={styles.nutrientText}>
                        Protein: {item.nutrients.protein} g
                      </Text>
                      <Text style={styles.nutrientText}>
                        Carbs: {item.nutrients.carbohydrates} g
                      </Text>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                keyboardShouldPersistTaps="handled"
              />
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Add New Food</Text>
              <ScrollView keyboardShouldPersistTaps="handled">
                {[
                  'name',
                  'calories',
                  'fats',
                  'protein',
                  'carbohydrates',
                  'image',
                ].map((field) => (
                  <TextInput
                    key={field}
                    style={styles.input}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    placeholderTextColor="#3c6cbe"
                    value={newFood[field]}
                    keyboardType={
                      field !== 'name' && field !== 'image'
                        ? 'numeric'
                        : 'default'
                    }
                    onChangeText={(text) =>
                      setNewFood({ ...newFood, [field]: text })
                    }
                  />
                ))}
                <TouchableOpacity style={styles.addButton} onPress={addFood}>
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color="#ffffff"
                  />
                  <Text style={styles.addButtonText}>Add Food</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d1e9ff',
    padding: 20,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#1e3a76',
    opacity: 0.5,
    padding: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a76',
    textAlign: 'center',
    marginVertical: 10,
  },
  foodListContainer: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3c6cbe',
    marginTop: 20,
  },
  input: {
    height: 45,
    borderColor: '#5c8fff',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1e3a76',
  },
  nutrientText: {
    color: '#3c6cbe',
  },
  addButton: {
    backgroundColor: '#1e3a76',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default FoodDatabase;
