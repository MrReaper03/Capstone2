import React from "react";
import { foodData } from "./Data";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const FoodInfo = ({ barcode, onReset }) => {
  const foodItem = foodData.find((food) => food.name === barcode);

  if (!foodItem) return null;

  const { name, image, nutrients } = foodItem;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.nutrientsContainer}>
        <Text style={styles.heading}>Nutrients (per 100g)</Text>
        <View style={styles.nutrientItem}>
          <Text style={styles.nutrientLabel}>Calories:</Text>
          <Text style={styles.nutrientValue}>{nutrients.calories}</Text>
        </View>
        <View style={styles.nutrientItem}>
          <Text style={styles.nutrientLabel}>Fats:</Text>
          <Text style={styles.nutrientValue}>{nutrients.fats}g</Text>
        </View>
        <View style={styles.nutrientItem}>
          <Text style={styles.nutrientLabel}>Protein:</Text>
          <Text style={styles.nutrientValue}>{nutrients.protein}g</Text>
        </View>
        <View style={styles.nutrientItem}>
          <Text style={styles.nutrientLabel}>Carbohydrates:</Text>
          <Text style={styles.nutrientValue}>{nutrients.carbohydrates}g</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onReset}>
        <Text style={styles.buttonText}>Scan another item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
    borderTopColor: "#3e6732",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#343A40",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  nutrientsContainer: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#343A40",
  },
  nutrientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  nutrientLabel: {
    color: "#6C757D",
  },
  nutrientValue: {
    color: "#28A745",
  },
  button: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 50,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default FoodInfo;
