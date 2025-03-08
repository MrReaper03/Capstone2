import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sidebar from './Sidebar';
import { starters, mainCourse, dessert } from './mealData';

const STORAGE_KEYS = {
  TODAY: 'todaySelections',
  YESTERDAY: 'yesterdaySelections',
  TOMORROW: 'tomorrowSelections',
  DATE: 'date',
};

const TodaysCourse = ({ navigation }) => {
  const [mealTime, setMealTime] = useState(null); // "Breakfast", "Lunch", "Dinner"
  const [currentCategory, setCurrentCategory] = useState(null); // "Starters", "Main", "Dessert"
  const [currentData, setCurrentData] = useState([]);

  const [selections, setSelections] = useState({
    Breakfast: { main: null, dessert: null },
    Lunch: { main: null, dessert: null },
    Dinner: { main: null, dessert: null },
  });

  const [yesterdaySelections, setYesterdaySelections] = useState(null);
  const [tomorrowSelections, setTomorrowSelections] = useState({
    Breakfast: { main: null, dessert: null },
    Lunch: { main: null, dessert: null },
    Dinner: { main: null, dessert: null },
  });

  // Modal visibility states
  const [isYesterdayModalVisible, setIsYesterdayModalVisible] = useState(false);
  const [isTomorrowModalVisible, setIsTomorrowModalVisible] = useState(false);

  useEffect(() => {
    const loadSelections = async () => {
      try {
        const today = await AsyncStorage.getItem(STORAGE_KEYS.TODAY);
        const yesterday = await AsyncStorage.getItem(STORAGE_KEYS.YESTERDAY);
        const tomorrow = await AsyncStorage.getItem(STORAGE_KEYS.TOMORROW);
        const storedDate = await AsyncStorage.getItem(STORAGE_KEYS.DATE);

        const todayDate = new Date();
        const yesterdayDate = new Date(todayDate.getTime() - 86400000);
        const tomorrowDate = new Date(todayDate.getTime() + 86400000);

        if (storedDate && storedDate !== todayDate.toISOString()) {
          await AsyncStorage.setItem(STORAGE_KEYS.YESTERDAY, today);
          setYesterdaySelections(JSON.parse(today));

          await AsyncStorage.setItem(STORAGE_KEYS.TODAY, tomorrow);
          setSelections(JSON.parse(tomorrow));

          await AsyncStorage.setItem(
            STORAGE_KEYS.TOMORROW,
            JSON.stringify({
              Breakfast: { main: null, dessert: null },
              Lunch: { main: null, dessert: null },
              Dinner: { main: null, dessert: null },
            })
          );
          setTomorrowSelections({
            Breakfast: { main: null, dessert: null },
            Lunch: { main: null, dessert: null },
            Dinner: { main: null, dessert: null },
          });
        } else {
          if (today) setSelections(JSON.parse(today));
          if (yesterday) setYesterdaySelections(JSON.parse(yesterday));
          if (tomorrow) setTomorrowSelections(JSON.parse(tomorrow));
        }

        await AsyncStorage.setItem(STORAGE_KEYS.DATE, todayDate.toISOString());
      } catch (error) {
        console.error('Failed to load selections from AsyncStorage', error);
      }
    };

    loadSelections();
  }, []);

  useEffect(() => {
    const saveSelections = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.TODAY,
          JSON.stringify(selections)
        );
      } catch (error) {
        console.error('Failed to save selections to AsyncStorage', error);
      }
    };

    saveSelections();
  }, [selections]);

  const handleMealTimeSelection = (time) => {
    setMealTime(time);
    setCurrentCategory(null); // Reset the category selection
  };

  const handleCategorySelection = (category) => {
    setCurrentCategory(category);
    switch (category) {
      case 'Main':
        setCurrentData(mainCourse);
        break;
      case 'Dessert':
        setCurrentData(dessert);
        break;
      default:
        setCurrentData([]);
        break;
    }
  };

  const handleItemSelected = (item, isTomorrow = false) => {
    if (!mealTime || !currentCategory) return;

    const updatedData = currentData.map((dish) =>
      dish.name === item.name
        ? { ...dish, isSelected: true }
        : { ...dish, isSelected: false }
    );
    setCurrentData(updatedData);

    const targetSelections = isTomorrow
      ? { ...tomorrowSelections }
      : { ...selections };
    targetSelections[mealTime][currentCategory.toLowerCase()] = item;
    isTomorrow
      ? setTomorrowSelections(targetSelections)
      : setSelections(targetSelections);
  };

  const confirmSelections = async (isTomorrow = false) => {
    if (isTomorrow) {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.TOMORROW,
          JSON.stringify(tomorrowSelections)
        );
        alert('Tomorrow’s selections confirmed!');
      } catch (error) {
        console.error('Failed to save tomorrow’s selections', error);
      }
    } else {
      alert('Selections Confirmed!');
    }
    setMealTime(null);
    setCurrentCategory(null);
  };

  const handleMoveToYesterday = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.YESTERDAY,
        JSON.stringify(selections)
      );
      setYesterdaySelections(selections);

      await AsyncStorage.setItem(
        STORAGE_KEYS.TODAY,
        JSON.stringify({
          Breakfast: { main: null, dessert: null },
          Lunch: { main: null, dessert: null },
          Dinner: { main: null, dessert: null },
        })
      );
      setSelections({
        Breakfast: { main: null, dessert: null },
        Lunch: { main: null, dessert: null },
        Dinner: { main: null, dessert: null },
      });
    } catch (error) {
      console.error('Failed to move today’s selections to yesterday', error);
    }
  };

  const handleMoveToTomorrow = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.TOMORROW,
        JSON.stringify(selections)
      );
      setTomorrowSelections(selections);

      await AsyncStorage.setItem(
        STORAGE_KEYS.TODAY,
        JSON.stringify({
          Breakfast: { main: null, dessert: null },
          Lunch: { main: null, dessert: null },
          Dinner: { main: null, dessert: null },
        })
      );
      setSelections({
        Breakfast: { main: null, dessert: null },
        Lunch: { main: null, dessert: null },
        Dinner: { main: null, dessert: null },
      });
      alert("Today's selections have been moved to Tomorrow.");
    } catch (error) {
      console.error('Failed to move today’s selections to tomorrow', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Today's Course</Text>

      <Text style={styles.subtitle}>Select Meal Time:</Text>
      <View style={styles.buttonGroup}>
        {['Breakfast', 'Lunch', 'Dinner'].map((time) => (
          <TouchableOpacity
            key={time}
            onPress={() => handleMealTimeSelection(time)}
            style={[
              styles.mealButton,
              mealTime === time && styles.selectedButton,
            ]}>
            <Text
              style={
                mealTime === time ? styles.selectedText : styles.buttonText
              }>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {mealTime && (
        <>
          <Text style={styles.subtitle}>Select Category:</Text>
          <View style={styles.buttonGroup}>
            {['Main', 'Dessert'].map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => handleCategorySelection(category)}
                style={[
                  styles.mealButton,
                  currentCategory === category && styles.selectedButton,
                ]}>
                <Text
                  style={
                    currentCategory === category
                      ? styles.selectedText
                      : styles.buttonText
                  }>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {mealTime && currentCategory && (
        <>
          <Text style={styles.subtitle}>
            Select {currentCategory} for {mealTime}:
          </Text>
          <FlatList
            data={currentData}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleItemSelected(item)}
                style={styles.itemButton}>
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
      )}

      {mealTime && (
        <TouchableOpacity
          onPress={() => confirmSelections()}
          style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Confirm Selections</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.subtitle}>Today's Selections:</Text>
      {['Breakfast', 'Lunch', 'Dinner'].map((time) => (
        <View key={time} style={styles.finalSelection}>
          <Text style={styles.finalTitle}>{time}:</Text>
          <Text>Main: {selections[time]?.main?.name || 'None'}</Text>
          <Text>Dessert: {selections[time]?.dessert?.name || 'None'}</Text>
        </View>
      ))}

      <TouchableOpacity
        onPress={handleMoveToYesterday}
        style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Move to Yesterday</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleMoveToTomorrow}
        style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Move to Tomorrow</Text>
      </TouchableOpacity>

      {/* Show Yesterday's Selections */}
      <TouchableOpacity
        onPress={() => setIsYesterdayModalVisible(true)}
        style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Show Yesterday's Course</Text>
      </TouchableOpacity>

      {/* Show Tomorrow's Selections */}
      <TouchableOpacity
        onPress={() => setIsTomorrowModalVisible(true)}
        style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Show Tomorrow's Course</Text>
      </TouchableOpacity>

      {/* Modal for Yesterday's Selections */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isYesterdayModalVisible}
        onRequestClose={() => setIsYesterdayModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.enhancedModalContent}>
            <Text style={styles.modalTitle}>Yesterday's Selections</Text>
            {yesterdaySelections &&
              ['Breakfast', 'Lunch', 'Dinner'].map((time) => (
                <View key={time} style={styles.finalSelection}>
                  <Text style={styles.finalTitle}>{time}:</Text>
                  <Text>
                    Main: {yesterdaySelections[time]?.main?.name || 'None'}
                  </Text>
                  <Text>
                    Dessert:{' '}
                    {yesterdaySelections[time]?.dessert?.name || 'None'}
                  </Text>
                </View>
              ))}
            <TouchableOpacity
              onPress={() => setIsYesterdayModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Tomorrow's Selections */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isTomorrowModalVisible}
        onRequestClose={() => setIsTomorrowModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.enhancedModalContent}>
            <Text style={styles.modalTitle}>Tomorrow's Selections</Text>
            {tomorrowSelections &&
              ['Breakfast', 'Lunch', 'Dinner'].map((time) => (
                <View key={time} style={styles.finalSelection}>
                  <Text style={styles.finalTitle}>{time}:</Text>
                  <Text>
                    Main: {tomorrowSelections[time]?.main?.name || 'None'}
                  </Text>
                  <Text>
                    Dessert: {tomorrowSelections[time]?.dessert?.name || 'None'}
                  </Text>
                </View>
              ))}
            <TouchableOpacity
              onPress={() => setIsTomorrowModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Sidebar navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#c4f3e6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e4d3d',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#3a7859',
    marginTop: 16,
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  mealButton: {
    padding: 10,
    backgroundColor: '#8de2d1',
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: '#1e4d3d',
  },
  buttonText: {
    color: '#000',
  },
  selectedText: {
    color: '#fff',
  },
  itemButton: {
    padding: 10,
    backgroundColor: '#51c8a8',
    borderWidth: 1,
    borderColor: '#3a7859',
    marginBottom: 8,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#1e4d3d',
  },
  confirmButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#3a7859',
    borderRadius: 8,
  },
  confirmButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  finalSelection: {
    marginBottom: 16,
    backgroundColor: '#8de2d1',
    padding: 10,
    borderRadius: 8,
  },
  finalTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e4d3d',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker background for visibility
  },
  enhancedModalContent: {
    width: '85%',
    backgroundColor: '#1e4d3d', // Royal green theme
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c4f3e6',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#3a7859',
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TodaysCourse;
