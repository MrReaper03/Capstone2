import AsyncStorage from '@react-native-async-storage/async-storage';

export const foodData = [
  {
    id: 1,
    name: 'Apple',
    image: require('../foodpic/apple.jpg'),
    nutrients: {
      calories: 52,
      fats: 0.2,
      protein: 0.3,
      carbohydrates: 13.8,
    },
  },
  {
    id: 2,
    name: 'Baguio Beans',
    image: require('../foodpic/baguio-beans.jpg'),
    nutrients: {
      calories: 97,
      fats: 0.3,
      protein: 0.7,
      carbohydrates: 22.7,
    },
  },

  {
    id: 3,
    name: 'Orange',
    image: require('../foodpic/orange.jpg'),
    nutrients: {
      calories: 47,
      fats: 0.1,
      protein: 0.9,
      carbohydrates: 11.8,
    },
  },
  {
    id: 4,
    name: 'Grapes',
    image: require('../foodpic/grapes.jpg'),
    nutrients: {
      calories: 69,
      fats: 0.2,
      protein: 0.7,
      carbohydrates: 18.1,
    },
  },
  {
    id: 5,
    name: 'Pineapple',
    image: require('../foodpic/pineapple.jpg'),
    nutrients: {
      calories: 50,
      fats: 0.1,
      protein: 0.5,
      carbohydrates: 13.1,
    },
  },
  {
    id: 6,
    name: 'Cabbage',
    image: require('../foodpic/cabbage.jpg'),
    nutrients: {
      calories: 25,
      fats: 0.1,
      protein: 1.3,
      carbohydrates: 5.8,
    },
  },
  {
    id: 7,
    name: 'Carrots',
    image: require('../foodpic/carrots.jpg'),
    nutrients: {
      calories: 41,
      fats: 0.2,
      protein: 0.9,
      carbohydrates: 9.6,
    },
  },
  {
    id: 8,
    name: 'Cauliflower',
    image: require('../foodpic/cauliflower.jpg'),
    nutrients: {
      calories: 25,
      fats: 0.3,
      protein: 2.0,
      carbohydrates: 4.9,
    },
  },
  {
    id: 9,
    name: 'Mango',
    image: require('../foodpic/mango.jpg'),
    nutrients: {
      calories: 60,
      fats: 0.4,
      protein: 0.8,
      carbohydrates: 15,
    },
  },
  {
    id: 10,
    name: 'Chayote',
    image: require('../foodpic/chayote.jpg'),
    nutrients: {
      calories: 19,
      fats: 0.1,
      protein: 0.8,
      carbohydrates: 4.5,
    },
  },
  {
    id: 11,
    name: 'Eggplant',
    image: require('../foodpic/eggplant.jpg'),
    nutrients: {
      calories: 25,
      fats: 0.2,
      protein: 1.0,
      carbohydrates: 5.9,
    },
  },
  {
    id: 12,
    name: 'Lettuce',
    image: require('../foodpic/lettuce.jpg'),
    nutrients: {
      calories: 15,
      fats: 0.2,
      protein: 1.4,
      carbohydrates: 2.9,
    },
  },
  {
    id: 12,
    name: 'Milkfish',
    image: require('../foodpic/milkfish.jpg'),
    nutrients: {
      calories: 165,
      fats: 6.0,
      protein: 22.0,
      carbohydrates: 0.0,
    },
  },
  {
    id: 13,
    name: 'Okra',
    image: require('../foodpic/okra.jpg'),
    nutrients: {
      calories: 33,
      fats: 0.2,
      protein: 1.9,
      carbohydrates: 7.5,
    },
  },
  {
    id: 14,
    name: 'Potato',
    image: require('../foodpic/potato.jpg'),
    nutrients: {
      calories: 77,
      fats: 0.1,
      protein: 2.0,
      carbohydrates: 17.6,
    },
  },
  {
    id: 15,
    name: 'Salmon',
    image: require('../foodpic/salmon.jpg'),
    nutrients: {
      calories: 208,
      fats: 13.0,
      protein: 20.0,
      carbohydrates: 0.0,
    },
  },
  {
    id: 16,
    name: 'Shrimp',
    image: require('../foodpic/shrimp.jpg'),
    nutrients: {
      calories: 99,
      fats: 0.3,
      protein: 24.0,
      carbohydrates: 0.2,
    },
  },
  {
    id: 17,
    name: 'Squash',
    image: require('../foodpic/squash.jpg'),
    nutrients: {
      calories: 45,
      fats: 0.1,
      protein: 1.0,
      carbohydrates: 10.0,
    },
  },

  {
    id: 18,
    name: 'Onion',
    image: require('../foodpic/onion.jpg'),
    nutrients: {
      calories: 40,
      fats: 0.1,
      protein: 1.1,
      carbohydrates: 9.3,
    },
  },
  {
    id: 19,
    name: 'Beef Cube',
    image: require('../foodpic/beef-cube.jpg'),
    nutrients: {
      calories: 250,
      fats: 20.0,
      protein: 17.0,
      carbohydrates: 0.0,
    },
  },
  {
    id: 20,
    name: 'Bittergourd',
    image: require('../foodpic/bittergourd.jpg'),
    nutrients: {
      calories: 34,
      fats: 0.2,
      protein: 1.0,
      carbohydrates: 7.0,
    },
  },
  {
    id: 21,
    name: 'Breast Fillet',
    image: require('../foodpic/breast-fillet.jpg'),
    nutrients: {
      calories: 165,
      fats: 3.6,
      protein: 31.0,
      carbohydrates: 0.0,
    },
  },
  {
    id: 22,
    name: 'Egg',
    image: require('../foodpic/eggs.jpg'),
    nutrients: {
      calories: 155,
      fats: 11,
      protein: 13,
      carbohydrates: 1.1,
    },
  },
];

const storeFoodData = async () => {
  try {
    const jsonValue = JSON.stringify(foodData);
    await AsyncStorage.setItem('@food_data', jsonValue);
    console.log('Food data stored successfully!');
  } catch (e) {
    console.error('Failed to save food data:', e);
  }
};

const getFoodData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@food_data');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to load food data:', e);
  }
};

// Example usage
const initializeData = async () => {
  await storeFoodData(); // Save the food data
  const data = await getFoodData(); // Retrieve the food data
  console.log('Retrieved Food Data:', data);
};

// Call this function when you want to initialize data
initializeData();
