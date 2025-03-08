import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sidebar from './Sidebar';

const WeightChecker = ({ navigation }) => {
  const [goalWeight, setGoalWeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [weightRecords, setWeightRecords] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const records = await AsyncStorage.getItem('@weightRecords');
        const savedGoalWeight = await AsyncStorage.getItem('@goalWeight');

        if (records !== null) {
          setWeightRecords(JSON.parse(records));
        }

        if (savedGoalWeight !== null) {
          setGoalWeight(savedGoalWeight);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@weightRecords', JSON.stringify(weightRecords));
        await AsyncStorage.setItem('@goalWeight', goalWeight);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    saveData();
  }, [weightRecords, goalWeight]);

  const handleAddWeight = () => {
    if (currentWeight === '') {
      alert('Please enter your current weight.');
      return;
    }

    const weightRecord = {
      date: new Date().toLocaleDateString(),
      weight: currentWeight,
    };

    setWeightRecords([...weightRecords, weightRecord]);

    const weightDifference = goalWeight - currentWeight;
    if (weightDifference === 0) {
      setMessage('Congratulations! You have reached your goal weight.');
    } else if (weightDifference > 0) {
      setMessage(`You need to gain ${weightDifference} kg to reach your goal weight.`);
    } else {
      setMessage(`You have exceeded your goal weight by ${Math.abs(weightDifference)} kg.`);
    }
  };

  const handleReset = () => {
    setGoalWeight('');
    setCurrentWeight('');
    setWeightRecords([]);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Weight Tracker</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your goal weight (kg)"
        keyboardType="numeric"
        value={goalWeight}
        onChangeText={(text) => setGoalWeight(text)}
        placeholderTextColor="#8de2d1"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your current weight (kg)"
        keyboardType="numeric"
        value={currentWeight}
        onChangeText={(text) => setCurrentWeight(text)}
        placeholderTextColor="#8de2d1"
      />
      <Button title="Record Weight" onPress={handleAddWeight} color="#3a7859" />
      <Button title="Reset" onPress={handleReset} color="#1e4d3d" />
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.subHeader}>Weight Records:</Text>
      {weightRecords.map((record, index) => (
        <View key={index} style={styles.record}>
          <Text style={styles.recordText}>{record.date}</Text>
          <Text style={styles.recordText}>{record.weight} kg</Text>
        </View>
      ))}
      <Sidebar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#c4f3e6',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e4d3d',
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '85%',
    borderColor: '#51c8a8',
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e4d3d',
    textAlign: 'center',
  },
  subHeader: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e4d3d',
  },
  record: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    backgroundColor: '#8de2d1',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  recordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e4d3d',
  },
});

export default WeightChecker;
