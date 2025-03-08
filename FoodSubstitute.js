import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from "react-native";
import { foodData } from "./Data";
import { foodSubData } from "./SubFood";
import { Ionicons } from "@expo/vector-icons";
import Sidebar from './Sidebar';

const FoodSubstitute = ({ navigation }) => {
  const [foodName, setFoodName] = useState("");
  const [substitutes, setSubstitutes] = useState([]);

  const compareNutrients = () => {
    const selectedFood = foodData.find(
      (food) => food.name.toLowerCase() === foodName.toLowerCase()
    );

    if (!selectedFood) {
      alert("Food not found in database");
      return;
    }

    const differences = foodSubData.map((subFood) => {
      return {
        id: subFood.id,
        difference:
          Math.abs(
            selectedFood.nutrients.calories - subFood.nutrients.calories
          ) +
          Math.abs(selectedFood.nutrients.fats - subFood.nutrients.fats) +
          Math.abs(selectedFood.nutrients.protein - subFood.nutrients.protein) +
          Math.abs(
            selectedFood.nutrients.carbohydrates -
              subFood.nutrients.carbohydrates
          ),
      };
    });

    differences.sort((a, b) => a.difference - b.difference);

    const closestSubstitutes = differences
      .slice(0, 3)
      .map((sub) => foodSubData.find((data) => data.id === sub.id));

    setSubstitutes(closestSubstitutes);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <Text style={styles.title}>Find Food Substitutes</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={20} color="#8de2d1" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter food name"
          value={foodName}
          onChangeText={setFoodName}
          placeholderTextColor="#8de2d1"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={compareNutrients}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollView}>
        {substitutes.map((substitute) => (
          <View key={substitute.id} style={styles.substituteContainer}>
            <Text style={styles.name}>{substitute.name}</Text>
            <Image source={{ uri: substitute.image }} style={styles.image} />
            <View style={styles.nutrientContainer}>
              <Text style={styles.nutrient}>
                <Text style={styles.bold}>Calories:</Text> {substitute.nutrients.calories}
              </Text>
              <Text style={styles.nutrient}>
                <Text style={styles.bold}>Fats:</Text> {substitute.nutrients.fats}
              </Text>
              <Text style={styles.nutrient}>
                <Text style={styles.bold}>Protein:</Text> {substitute.nutrients.protein}
              </Text>
              <Text style={styles.nutrient}>
                <Text style={styles.bold}>Carbohydrates:</Text> {substitute.nutrients.carbohydrates}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <Sidebar navigation={navigation} />
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1e4d3d",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#c4f3e6",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a7859",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    color: "#c4f3e6",
  },
  button: {
    backgroundColor: "#51c8a8",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: "#1e4d3d",
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollView: {
    marginTop: 20,
  },
  substituteContainer: {
    marginBottom: 20,
    backgroundColor: "#3a7859",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  name: {
    fontWeight: "bold",
    marginBottom: 10,
    color: "#c4f3e6",
    fontSize: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  nutrientContainer: {
    borderTopWidth: 1,
    borderTopColor: "#8de2d1",
    paddingTop: 10,
  },
  nutrient: {
    color: "#c4f3e6",
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
    color: "#51c8a8",
  },
});

export default FoodSubstitute;
